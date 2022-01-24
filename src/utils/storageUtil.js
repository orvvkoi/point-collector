import * as configs from "../configs";
import * as storage from "./lib/storage";
import * as arrayUtil from "./arrayUtil";
import * as stringUtil from "./stringUtil";
import * as dateUtil from "./dateUtil";

/**
 * getStorage
 * @returns {Promise<unknown>}
 */
export const getStorage = async () => {
    const storageData = await storage.getObjectFromStorage(configs.STORAGE_KEY);

    if (Object.keys(storageData).length === 0) {
        return;
    }

    const {[configs.STORAGE_KEY]: {...obj}} = {...storageData}

    return obj;
}

/**
 * setStorage
 * @param serviceKey
 * @param accountKey
 * @param newTransactions
 * @returns {Promise<boolean>}
 */
export const setStorage = async (serviceKey, accountKey, newTransactions) => {
    if (!serviceKey || !accountKey || !newTransactions) {
        return false;
    }

    let newData;

    let transactions = [...newTransactions];

    const storageData = await getStorage();

    const totalReward = arrayUtil.calculateTotal(transactions, 'reward');

    const todayTime = dateUtil.getTodayStartOf();

    if (storageData) {
        let {account: a, statistics: s, statisticsDetail: sd, transactions: t} = {...storageData}

        const accountId = a[accountKey];
        transactions = arrayUtil.addKeyValueAllArrayObjet(transactions, {accountId, serviceKey});

        if (t && t[todayTime]) {
            const ids = new Set(t[todayTime].map(o => o.id));
            t[todayTime] = [...t[todayTime], ...transactions.filter(o => !ids.has(o.id))];
        } else {
            t[todayTime] = transactions;
        }

        s['total'] = isNaN(s['total']) ? totalReward : parseInt(s['total']) + totalReward;
        s[serviceKey] = isNaN(s[serviceKey]) ? totalReward : parseInt(s[serviceKey]) + totalReward;

        sd[serviceKey] = {
            [accountId]: isNaN(sd[serviceKey][accountId]) ? totalReward : parseInt(sd[serviceKey][accountId]) + totalReward
        }

        newData = {[configs.STORAGE_KEY]: {a, s, sd, t}}
    } else {
        const randStr = stringUtil.generateRandomString();
        transactions = arrayUtil.addKeyValueAllArrayObjet(transactions, {accountId: randStr, serviceKey});

        newData = {
            [configs.STORAGE_KEY]: {
                'account': {
                    [serviceKey]: {
                        [accountKey]: randStr
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
                    [todayTime]: transactions
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
 * @param accountKey
 * @returns {Promise<*>}
 */
export const getAccountInfo = async (serviceKey, accountKey) => {
    const storageData = await getStorage();

    if (!storageData) {
        return;
    }

    const {account} = {...storageData}

    return serviceKey ? accountKey ? account[serviceKey][accountKey] : account[serviceKey] : account;
}

/**
 * getTransaction
 * @param property
 * @returns {Promise<*>}
 */
export const getTransaction = async ({...keyValuePair} = {}) => {
    const storageData = await getStorage();

    if (!storageData) {
        return;
    }

    const {transaction} = {...storageData}

    const filterKeys = Object.keys(keyValuePair);

    return filterKeys.length > 0 ? Object.keys(transaction).reduce((acc, date) => {
        const t = arrayUtil.filterArrayObject(transaction[date], keyValuePair);

        if (t.length > 0) {
            acc[date] = t;
        }

        return acc;
    }, {}) : transaction;
}

/**
 * getStatistics
 * @param serviceKey
 * @returns {Promise<*>}
 */
export const getStatistics = async (serviceKey) => {
    const storageData = await getStorage();

    if (!storageData) {
        return;
    }

    const {statistics} = {...storageData}

    return serviceKey ? statistics[serviceKey] : statistics;
}

/**
 * getStatisticsDetail
 * @param serviceKey
 * @param accountId
 * @returns {Promise<*>}
 */
export const getStatisticsDetail = async (serviceKey, accountId) => {
    const storageData = await getStorage();

    if (!storageData) {
        return;
    }

    const {statisticsDetail} = {...storageData}

    return serviceKey ? accountId ? statisticsDetail[serviceKey][accountId] : statisticsDetail[serviceKey] : statisticsDetail;
}