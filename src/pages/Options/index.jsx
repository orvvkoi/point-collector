import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';

render(
  <Options title={'Settings'} />,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();


//// options.js ////

// In-page cache of the user's options
/*
const options = {};

// Initialize the form with the user's option settings
chrome.storage.sync.get('options', (data) => {
    Object.assign(options, data.options);
    optionsForm.debug.checked = Boolean(options.debug);;
});

// Immediately persist options changes
optionsForm.debug.addEventListener('change', (event) => {
    options.debug = event.target.checked;
    chrome.storage.sync.set({options});
});*/
