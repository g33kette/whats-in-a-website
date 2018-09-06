import $ from 'jquery';

import hideContent from './hideContent';
import {setProcessingMessage} from './../scripts/store/actions';

export default (store) => {
    return new Promise((resolve) => {
        hideContent(store).then(() => {
            setTimeout(() => { // Wait 5 seconds for network content to load
                store.dispatch(setProcessingMessage('[2] Processing page...'));
                resolve($('body').text());
            }, 5000);
        });
    });
};
