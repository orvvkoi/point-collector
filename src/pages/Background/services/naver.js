import {NAVER} from "../configs";
import * as common from "../common";
import {getOnlyNumber, getTodayDate} from "../common";


/**
 * @TODO
 * 다른 계정임에도 불구하고 특정 항목은 중복으로 판단하여 적립이 되지 않음.
 * 쿠키 수정 가능 한지 검토.
 */
const accountInfo = async() => {
    const response = await fetch(NAVER.url['accountInfo'], NAVER.reqOpts.default);

    const json = await response.json();


    if(!json && json.code !== '00') {
        return;
    }

    const id = json.result.naverId;

    return id;
}

const verifyLogin = async () => {
    console.log('call verifyLogin')
    const response = await fetch(NAVER.url['verifyLogin'], NAVER.reqOpts.default);

    if (response.ok) {
        const mail = await response.json();

        return mail['RESULT'] === 'SUCCESS';
    } else {
        console.log("HTTP-Error: ", response.status);
        return false;
    }
}

const fetchRewards = async (url = NAVER.url['fetchRewards']) => {
    const response = await fetch(url, NAVER.reqOpts.default);

    const reward = await response.json();

    console.log('reward ', reward.code)

    return reward.code === "00" && reward.result.ads;
}

const allowedOnlyOnceRewardFilter = (rewards = []) => {
    return rewards.filter(
        reward => (reward.viewUrl && reward.viewUrl.indexOf('click-point') > -1)
    ).map(reward => {
        reward.type = 'once';
        reward.reqUrl = reward.viewUrl.indexOf('click-point?') ? reward.viewUrl.split('?').join('\/?') : reward.viewUrl;
        reward.originUrl = reward.viewUrl;

        return reward;
    });
}

const everyDayRewardsFilter = (rewards = []) => {
    return rewards.filter(
        (data) => {
            return data.subtitle.indexOf('보러가면') > -1
                || data.subtitle.indexOf('클릭만') > -1
        }
    ).map(reward => {
        reward.type = 'every';
        reward.reqUrl = NAVER.url.everyDayRewards(reward.parentId);
        reward.originUrl = reward.reqUrl;

        return reward;
    });
}

const mobileRewardsFilter = (rewards = []) => {
    return rewards.filter(
        (data) => {
            return data.subtitle.indexOf('방문하면') > -1
        }
    ).map(reward => {
        reward.type = 'mobile';
        reward.originUrl = reward.reqUrl;
        reward.reqUrl = NAVER.url.everyDayRewards(reward.id);

        return reward;
    });
}

/**
 * @TODO
 * 모바일에서만 적립 가능한 항목 확인.
 * 스토어 방문에 대하여 작동 안함.
 * User-agent로 체크 안함. 분석 필요.
 */
const getAvailableRewards = async (accountId) => {
    const rewards = await fetchRewards();
    // const mobileRewards = await fetchRewards(NAVER.url['fetchMobileRewards']);

    const onceRewards = allowedOnlyOnceRewardFilter(rewards);
    const everyDayRewards = everyDayRewardsFilter(rewards);
    // const mobileRewardsTest = mobileRewardsFilter(mobileRewards);

    if (!rewards && !everyDayRewards && !onceRewards) {
        return false;
    }

    let result = [...onceRewards, ...everyDayRewards];

    console.log('onceRewards ', onceRewards)
    console.log('everyDayRewards ', everyDayRewards)

    /**
     * @TODO
     *  click 리워드, 적립을 했음에도 목록에 나오는 경우가 있음. 다시 확인 필요.
     * 필요에 따라, 필터 수행.
     * -> 처리는 했지만 최적화 필요
     */
    const transaction = await common.getTransaction({accountId, serviceKey: NAVER.serviceKey});

    if(transaction && Object.keys(transaction).length > 0) {
        const ids = Object.keys(transaction).map(key=> {
            return transaction[key].map(t=>t.id);
        }).reduce((a,b) => {
            return a.concat(b);
        }, []);

        result = result.filter(o=> {
            return !ids.includes(o.id)
        });
    }

    return result;
}

const fetchRewardResults = async (accountId, rewards) => {
    if (!accountId || !rewards) {
        return false;
    }

    const serviceKey = NAVER.serviceKey;
    const createdAt = common.getTime();

    let responses = await Promise.allSettled(rewards.map(async reward => {
        const response = await fetch(reward.reqUrl, NAVER.reqOpts[reward.type]);

        const responseText = await response.text();

        let isSuccess = false;

        if (response.status === 200) {
            /**
             * @TODO
             * 별도의 안내 메세지 없이 상품 페이지로 리다이텍트 되는 경우가 있음. 확인필요.
             */
            if (responseText.indexOf('SUCCESS') > -1) {
                isSuccess = true;

                if(reward.type === 'every' || reward.type === 'mobile') {
                    /**
                     * @TODO
                     * rewardText 대로 주는지 확인 필요. 불규칙함.
                     * type이 every인 경우 별도의 alert 발생하지 않는것으로 보임.
                     * rewardText 로 임시 대체 (rewardText= '10원')
                     */
                    const point = common.getOnlyNumber(reward.rewardText);

                    reward.reward = point;
                } else {
                    const point = (() => {
                        let point;
                        /**
                         * @TODO
                         * clickRewardAmount가 있는 경우도 있음.
                         * 규칙적이지 않음.
                         */
                        if(reward.clickRewardAmount) {
                            point = reward.clickRewardAmount;
                        } else {
                            point = getOnlyNumber(responseText.split('alert')[1].split(');')[0]);
                        }

                        return point;
                    })();

                    reward.reward = point;
                }
            } else if(responseText.indexOf('PASS') > -1){
                reward.reason = responseText.indexOf('alert') > -1 ? responseText.split('alert("')[1].split('");')[0] : 'unknown';
            }

            /**
             * @TODO
             * 매일 적립인 경우
             * 적립 시간이 아니거나, 이미 적립된 경우, 금일 적립 이벤트가 종료된 경우.
             * 400에러 반환함.
             * 반환 메세지 -> {"code":411,"message":"잘못된 파라미터 입니다."}
             */
        } else if(response.status === 400) {
            reward.reason = `이미 적립 또는 금일 적립 이벤트가 종료 되었습니다.`;
        } else {
            console.log('Something is wrong, http status: ', response.status);
            reward.reason = `Something is wrong, http status: ${response.status}`;
        }

        let payload = {
            id: reward.id,
            title: reward.title,
            reward: reward.reward,
            originUrl: reward.originUrl,
            serviceKey,
            accountId,
            isSuccess,
            createdAt
        }

        if(!isSuccess) {
            payload.reason = reward.reason;
        }

        return Promise.resolve(payload);
    }));

    responses = responses.map(result => result.value);

    return responses;
}

const process = async () => {
    const isLogin = await verifyLogin();
    if (!isLogin) {
        return false;
    }

    const accountId = await accountInfo();
    console.log('accountId: ', accountId);

    /**
     * @TODO
     * backend 에러. 처리 필요.
     * 계정 정보 가져오는 부분. 안되면 my.html로 대체
     */
    if(!accountId) {
        console.log('Error getting your account information.');

        return;
    }

    const rewards = await getAvailableRewards(accountId);
    console.log('getAvailableRewards: ', rewards);

    if(!rewards || rewards.length === 0) {
        return;
    }

    const payload = await fetchRewardResults(accountId, rewards);
    console.log('fetchRewardResults: ', payload);

    await common.setStorage(NAVER.serviceKey, accountId, payload);

    return payload;
}

export default process;