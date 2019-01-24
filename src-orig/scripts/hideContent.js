import $ from 'jquery';
import {setProcessingMessage, setProcessingLoading, setRemoveFrame} from './../scripts/store/actions';

let body;
let frame = $('<iframe ' +
    'style="width: 100% !important; height: 100vh !important; top: 0 !important; right: 0 !important; ' +
    'position: fixed !important; z-index: 9999999999999999999999999999999999999999999999999999999999999 !important;" ' +
    'src="'+chrome.runtime.getURL('pages/protection_overlay.html')+'"></iframe>');

export default (store) => {
    store.subscribe(() => {
        // todo this subscribe is not triggering when the storage is updated from frame.js... :(
        console.log('remove frame?', store.getState().removeFrame);
        if (store.getState().removeFrame) {
            store.dispatch(setRemoveFrame(false));
            body.remove(frame);
        }
    });
    return new Promise((resolve) => {
        let page = $('html');
        page.hide();
        $(document).ready(() => {
            body = $('body');
            body.css('overflow', 'hidden');
            body.prepend(frame);
            setTimeout(() => { // Allow time for iFrame to load
                page.show();
                store.dispatch(setProcessingMessage('[1] Reading page...'));
                store.dispatch(setProcessingLoading(true));
                resolve();
            }, 500);
        });
    });
};
