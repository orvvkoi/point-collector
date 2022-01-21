import moment from "moment";
import * as configs from "../configs";
import * as storage from "../modules/storage";

/**
 *
 * @returns {string} date format: yyyy-MM-dd
 */
export const getTodayDate = () => {
    const date = new Date().toISOString().split('T')[0];

    return date;
}

/**
 *
 * @returns {string} date format: timestamp
 */
export const getTime = () => {
    const date = moment.utc().valueOf();

    return date;
}

/**
 *
 * @returns {string} date format: timestamp
 */
export const dateFormat = (timestamp, format) => {
    const date = moment(parseInt(timestamp)).utc().local().format(format);

    return date;
}

export const getOnlyNumber = (str) => {
    if(!str) return;

    const regex = /[^0-9]/g;
    const result = str.replace(regex, '');

    return result;
}

/**
 * generateRandomString
 * @returns {string} 5 characters are returned.
 */
export const generateRandomString = () => {
    const str = Math.random().toString(36).slice(8);

    return str;
}

/**
 * getFavicon
 * @param domain
 * @returns {`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=16&url=${string}`}
 */
export const getFavicon = (domain) => {
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=19&url=${domain}`
}

/**
 * getServiceConfig
 * @param key service key
 */
export const getServiceConfig = (serviceKey) => {
    if(!serviceKey) {
        return;
    }

    const result = configs[serviceKey.toUpperCase()];

    return result;
}

/**
 * getStorage
 * @returns {Promise<unknown>}
 */
export const getStorage = async() => {
    const storageData = await storage.getObjectFromStorage(configs.STORAGE_KEY);

    console.log('getStorage ',  storageData)

    if(Object.keys(storageData).length === 0) {
        return;
    }

    const {[configs.STORAGE_KEY]: {...obj}} = {...storageData}

    return obj;
}

/**
 * setStorage
 * @param serviceKey
 * @param accountId
 * @param newTransactions
 * @returns {Promise<boolean>}
 */
export const setStorage = async(serviceKey, accountId, newTransactions) => {
    if(!serviceKey || !accountId || !newTransactions) {
        return false;
    }

    let transactions = [...newTransactions];

    const today = moment(getTodayDate()).utc().valueOf();

    const storageData = await getStorage();

    const totalReward = transactions.reduce(
        (acc, obj) => {
            const reward = obj.reward ? acc + parseInt(obj.reward) : acc;

            return reward;
        }, 0);

    const getUpdateTransactions = (accountId) => {
        return transactions.map(obj=> {
            obj.serviceKey = serviceKey;
            obj.accountId = accountId;

            return obj;
        });
    }

    let newData;

    if(storageData) {
        let {account: a, statistics: s, statisticsDetail: sd, transactions: t} = {...storageData}

        const accountId = a[accountId];
        transactions = getUpdateTransactions(accountId);

        if(t && t[today]) {
            const ids = new Set(t[today].map(o => o.id));
            t[today] = [...t[today], ...transactions.filter(o => !ids.has(o.id))];
        } else {
            t[today] = transactions;
        }

        s['total'] = isNaN(s['total']) ? totalReward : parseInt(s['total']) + totalReward;
        s[serviceKey] = isNaN(s[serviceKey]) ? totalReward : parseInt(s[serviceKey]) + totalReward;

        sd[serviceKey] = {
            [accountId]: isNaN(sd[serviceKey][accountId]) ? totalReward : parseInt(sd[serviceKey][accountId]) + totalReward
        }

        newData = {[configs.STORAGE_KEY]: { a, s, sd, t } }
    } else {
        const randStr = generateRandomString();
        transactions = getUpdateTransactions(randStr);

        newData = {
            [configs.STORAGE_KEY]: {
                'account': {
                    [serviceKey]: {
                        [accountId]: randStr
                    }
                },
                'statistics': {
                    'total': totalReward,
                    [serviceKey]: totalReward
                },
                'statisticsDetail': {
                    [serviceKey]: {
                        [randStr]: totalReward
                    }
                },
                'transaction': {
                    [today] : transactions
                }
            }
        }
    }

    console.log('setStorage newData', newData)

    await storage.setObjectInStorage(newData);
}


/**
 * getAccountInfo
 * @param serviceKey
 * @param accountId
 * @returns {Promise<*>}
 */
export const getAccountInfo = async(serviceKey, accountId) => {
    const storageData = await getStorage();

    if(!storageData) {
        return;
    }

    const {account} = {...storageData}

    const payload = serviceKey ? accountId ? account[serviceKey][accountId] : account[serviceKey] : account;

    return payload;
}

/**
 * getTransaction
 * @param property
 * @returns {Promise<*>}
 */
export const getTransaction = async({...filterKey} = {}) => {
    const storageData = await getStorage();

    if(!storageData) {
        return;
    }

    const {transaction} = {...storageData}

    const filterKeys = Object.keys(filterKey);

    const payload = filterKeys.length > 0 ? Object.keys(transaction).reduce((acc, date) => {
        const t = transaction[date].filter(t=> {
            return filterKeys.every(key=> t[key] === filterKey[key]);
        });

        if(t.length > 0) {
            acc[date] = t;
        }

        return acc;
    }, {}) : transaction;

    return payload;
}

/**
 * getStatistics
 * @param serviceKey
 * @param accountId
 * @returns {Promise<*>}
 */
export const getStatistics = async(serviceKey) => {
    const storageData = await getStorage();

    if(!storageData) {
        return;
    }

    const {statistics} = {...storageData}

    const payload = serviceKey ?  statistics[serviceKey] : statistics;

    return payload;
}

/**
 * getStatisticsDetail
 * @param serviceKey
 * @param accountId
 * @returns {Promise<*>}
 */
export const getStatisticsDetail = async(serviceKey, accountId) => {
    const storageData = await getStorage();

    if(!storageData) {
        return;
    }

    const {statisticsDetail} = {...storageData}

    const payload = serviceKey ? accountId ? statisticsDetail[serviceKey][accountId] : statisticsDetail[serviceKey] : statisticsDetail;

    return payload;
}