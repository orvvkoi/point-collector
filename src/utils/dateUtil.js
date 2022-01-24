import moment from "moment-timezone";

/**
 * getTodayStartOf
 * @returns {number}
 */
export const getTodayStartOf = () => {
    return moment().utc().startOf('day').valueOf();
}

/**
 * getTime
 * @returns {number} utc timestamp
 */
export const getTime = () => {
    return moment.utc().valueOf();
}

/**
 * isSameDay
 * @param startTime utc timestamp
 * @param endTime utc timestamp
 * @returns {boolean}
 */
export const isSameDay = (startTime, endTime) => {
    const s = moment.utc(parseInt(startTime));
    const e = moment.utc(parseInt(endTime));

    return s.isSame(e, 'days');
}

/**
 * dateFormat
 * @param timestamp utc timestamp
 * @param format string
 * @returns {string}
 */
export const dateFormat = (timestamp, format) => {
    return moment.utc(parseInt(timestamp)).local().format(format);
}