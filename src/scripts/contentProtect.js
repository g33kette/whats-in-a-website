import $ from 'jquery';

import {hideContent, updateLoadingMessage} from './contentInterface';

let parseContent = () => {
    return new Promise((resolve) => {
        hideContent().then(() => {
            setTimeout(() => { // Wait 5 seconds for network content to load
                updateLoadingMessage('[2] Processing page...');
                resolve($('body').text());
            }, 5000);
        });
    });
};

export {parseContent};
