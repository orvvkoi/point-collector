import {naver} from './services';
import {storageUtil} from "../../utils";
import {NAVER} from "../../configs";


/*global chrome*/
chrome.runtime.onInstalled.addListener(() => {
    console.log('Chrome extension successfully installed!');
    return;
});

const process = async () => {
    const results = await naver();

    return results;
}

const requestStorage = async(key) => {
    const results = await storageUtil.getStorage(key);

    return results;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log('request.action ', request.action)

    /**
     * process
     * 포인트 적립 실행
     */
    if (request.action === 'process') {
        process().then(sendResponse);
    /**
     * request.storage
     * 저장된 데이터 요청
     * request.key
     * 저장된 데이터 키, key를 보내지 않으면 전체 데이터 반환
     */
    } else if(request.action === 'request.storage') {
        requestStorage().then(sendResponse);
    }

    return true;
});

//// background.js ////
/*

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});*/


// Watch for changes to the user's options & apply them
/*
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.options?.newValue) {
        const debugMode = Boolean(changes.options.newValue.debug);
        console.log('enable debug mode?', debugMode);
        setDebugMode(debugMode);
    }
});*/