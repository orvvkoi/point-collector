export const getCookie = (name) => {
    const cookies = document.cookie.split(';')
        .reduce((acc, cookieString) => {
            const [key, value] = cookieString.split('=').map(s => s.trim());
            if (key && value) {
                acc[key] = decodeURIComponent(value);
            }
            return acc;
        }, {});
    return name ? cookies[name] || '' : cookies;
}