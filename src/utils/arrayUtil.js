
export const calculateTotal = (arrayObject, key = 'reward') => {
    return arrayObject.reduce(
        (acc, obj) => {

            return obj[key] && !isNaN(obj[key]) ? acc + parseInt(obj[key]) : acc;
        }, 0);
}

export const addKeyValueAllArrayObjet = (arrayObject, injectObt = {}) => {
    return arrayObject.map(obj => {
        return {...obj, ...injectObt};
    });
}


/**
 *
 * @param arrayObject
 * @returns {*}
 */
export const reverseObjectByKey = (arrayObject) => {
    if (!arrayObject) return;

    //reverse는 compare 함수가 없다.
    return Object.keys(arrayObject).reverse().reduce(
        (obj, key) => {
            obj[key] = arrayObject[key];
            return obj;
        }, {});
}

/**
 *
 * @param arrayObject
 * @param keyValuePair
 * @returns {*}
 */
export const filterArrayObject = (arrayObject, {...keyValuePair} = {}) => {
    const keys = Object.keys(keyValuePair);

    return keys && arrayObject ? arrayObject.filter(t => {
        return keys.every(key => t[key] === keyValuePair[key]);
    }) : arrayObject;
}