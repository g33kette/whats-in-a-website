import $ from 'jquery';

import {hideContent} from './contentInterface';
import store from './../scripts/store/store';
import {setMessage} from './../scripts/store/actions';

let parseContent = () => {
    return new Promise((resolve) => {
        hideContent().then(() => {
            setTimeout(() => { // Wait 5 seconds for network content to load
                store.dispatch(setMessage('[2] Processing page...'));
                resolve($('body').text());
            }, 5000);
        });
    });
};

export {parseContent};
