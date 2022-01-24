import {getCookie} from '../../utils/cookieUtil';

const SES_COOKIE_NAME = 'NID_SES';
const AUT_COOKIE_NAME = 'NID_SES';

const sesCookie = getCookie(SES_COOKIE_NAME);
const autCookie = getCookie(AUT_COOKIE_NAME);

const hasCookie = !!(sesCookie && autCookie);

const process = () => {
    if(!hasCookie) {
        return;
    }

    chrome.runtime.sendMessage({
        'action': 'process'
    }, (response) => {
        console.log('process response: ', response)
    });
}
process();



/*
chrome.runtime.sendMessage({
    'NID_SES': getCookie('NID_SES'),
    'NID_AUT': getCookie('NID_AUT')
}, (response) => {
    console.log(response);
});
*/

