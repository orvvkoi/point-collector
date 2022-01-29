export const getCookie = (url, name, callback) => {
    chrome.cookies.get({"url": url, "name": name}, (cookie) => {
        if(callback) {
            callback(cookie.value);
        }
    });

}