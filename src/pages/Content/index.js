const process = () => {
    chrome.runtime.sendMessage({
        'action': 'process'
    }, (response) => {
        console.log('process response: ', response)
    });
}
process();
