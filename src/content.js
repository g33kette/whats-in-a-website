import $ from 'jquery';

chrome.runtime.sendMessage({get: 'enabled'}, (enabled) => {
    if (enabled) {
        hideContent().then((content) => {
            chrome.runtime.sendMessage({trigger: 'initialiseProcessing', content: content});
            // chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            //     console.log('tabs', tabs);
            // });
        });
    }
});

const hideContent = () => {
    const frame = $('<iframe ' +
        'style="width: 100% !important; height: 100vh !important; top: 0 !important; right: 0 !important; ' +
        'position: fixed !important; z-index: 999999999999999999999999999999999999999999999999999999999 !important;" ' +
        'src="'+chrome.runtime.getURL('pages/protection_overlay.html')+'"></iframe>');
    const page = $('html');
    page.hide();
    return new Promise((resolve) => {
        $(document).ready(() => {
            const body = $('body');
            const text = parseContent(body);
            body.css('overflow', 'hidden');
            body.prepend(frame);
            setTimeout(() => { // Allow time for iFrame to load
                page.show();
            }, 500);
            resolve(text);
        });
    });
};

const parseContent = (element) => {
    return element.text();
};
