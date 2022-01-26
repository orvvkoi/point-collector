const getObjectFromStorage = async function (key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value);
            });
        } catch (e) {
            reject(e);
        }
    });
};

const setObjectInStorage = async function (obj) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, function () {
                resolve(obj);
            });
        } catch (e) {
            reject(e);
        }
    });
};

const removeObjectFromStorage = async function (keys) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.remove(keys, function () {
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
};

export {
    setObjectInStorage,
    getObjectFromStorage,
    removeObjectFromStorage
}