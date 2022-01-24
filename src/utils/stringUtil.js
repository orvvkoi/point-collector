
export const getOnlyNumber = (str) => {
    if (!str) return;

    const regex = /[^0-9]/g;

    return str.replace(regex, '');
}

/**
 * generateRandomString
 * @returns {string} 5 characters are returned.
 */
export const generateRandomString = () => {
    return Math.random().toString(36).slice(8);
}
