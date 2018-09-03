import $ from 'jquery';

import {hideContent} from './contentInterface';
import {setSessionMessage} from './../scripts/store/actions';

let parseContent = (store) => {
    return new Promise((resolve) => {
        hideContent(store).then(() => {
            setTimeout(() => { // Wait 5 seconds for network content to load
                store.dispatch(setSessionMessage('[2] Processing page...'));
                resolve($('body').text());
            }, 5000);
        });
    });
};

export {parseContent};
