import $ from 'jquery';
import {setSessionMessage, setSessionLoading} from './../scripts/store/actions';

let frame = $('<iframe ' +
    'style="width: 100%; height: 100vh; z-index: 999999999999999999999999999999999999999999999999; position: fixed;" ' +
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
                store.dispatch(setSessionMessage('[1] Reading page...'));
                store.dispatch(setSessionLoading(true));
                resolve();
            }, 500);
        });
    });
};

export {hideContent};
