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
        'fetchRewards': 'https://new-m.pay.naver.com/api/adreward/list?pageSize=300&page=1&category=all&deviceType=pc&from=ad_list&collectionId=benefit&channelId=pay',
        'fetchMobileRewards': 'https://new-m.pay.naver.com/api/adreward/list?pageSize=300&page=1&category=all&deviceType=ios&from=ad_list&collectionId=benefit&channelId=pay',
        'mobileFetchUrl': (id) => `https://ofw.adison.co/u/naverpay/ads/${id}`,
        'everyDayRewards': (id) => `https://ofw.adison.co/u/api/v1/pubs/naverpay/ads/${id}/participate`
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
        mobile:{
            method: "post",
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1'
            }
        }
    }
}
