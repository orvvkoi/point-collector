import * as configs from "../configs"

/**
 * getFavicon
 * @param domain
 * @returns {string}
 */
export const getFavicon = (domain) => {
    return configs.FAVICON_URL(domain);
}

/**
 * getConfig
 * @param key
 * @returns {*}
 */
export const getConfig = (key) => {
    if (!key) return;

    return configs[key.toUpperCase()];
}

