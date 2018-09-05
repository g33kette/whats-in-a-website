import $ from 'jquery';
import {setScanMessage, setScanLoading} from './../scripts/store/actions';

let frame = $('<iframe ' +
    'style="width: 100% !important; height: 100vh !important; top: 0 !important; right: 0 !important; ' +
    'position: fixed !important; z-index: 9999999999999999999999999999999999999999999999999999999999999 !important;" ' +
    'src="'+chrome.runtime.getURL('pages/protection_overlay.html')+'"></iframe>');

let hideContent = (store) => {
    return new Promise((resolve) => {
        let page = $('html');
        page.hide();
        $(document).ready(() => {
            let body = $('body');
            body.css('overflow', 'hidden');
            body.prepend(frame);
            setTimeout(() => { // Allow time for iFrame to load
                page.show();
                store.dispatch(setScanMessage('[1] Reading page...'));
                store.dispatch(setScanLoading(true));
                resolve();
            }, 500);
        });
    });
};

export {hideContent};
