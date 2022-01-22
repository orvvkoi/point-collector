export const STORAGE_KEY = 'point-collector';
export const EXTENSION_ID = 'fnjnbigaldpfibknjoadnjlccokggkln';

export const TEST = {
    serviceKey: 'test',
    domain: 'https://www.google.com'
}

export const NAVER = {
    serviceKey: 'naver',
    domain: 'https://www.naver.com',
    url: {
        'accountInfo': 'https://new-m.pay.naver.com/api/common/member',
        'verifyLogin': 'https://www.naver.com/my/mail/external/mailCount',
        'summaryPoint': 'https://m.pay.naver.com/o/point/summaryPoint',
        'desktopReward': 'https://new-m.pay.naver.com/api/adreward/list?pageSize=300&page=1&category=all&deviceType=pc&from=ad_list&collectionId=benefit&channelId=pay',
        'mobileReward': 'https://new-m.pay.naver.com/api/adreward/list?pageSize=300&page=1&category=all&deviceType=ios&from=ad_list&collectionId=benefit&channelId=pay',
        'mobileToken': (adId, requestId) => `https://new-m.pay.naver.com/api/adreward/token?deviceType=ios&inventory=pay%3Ebenefit&placementId=all&adId=${adId}&target=ad_detail&requestId=${requestId}&from=ad_list`,
        'participate': (id) => `https://ofw.adison.co/u/api/v1/pubs/naverpay/ads/${id}/participate`,

    },
    reqOpts: {
        default: {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            }
        },
        once: {
            method: "get",
            mode: 'cors',
            redirect: 'manual',
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Visible-Redirect': '*',
            }
        },
        every: {
            method: "post",
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        },
        mobile: {
            method: "post",
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }
    }
}
