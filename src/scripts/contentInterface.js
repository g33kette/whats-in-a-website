import $ from 'jquery';

let container = $('<div id="bp">' +
    '<div class="footer">' +
    '<p>Browsing Protected by <span class="bpText">BrowserProtect</span></p>' +
    '</div>' +
    '</div>');
let fonts = [
    '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" ' +
    'integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" ' +
    'crossorigin="anonymous">',
    '<link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet">',
];
let loading = $(
    '<div class="loading">' +
    '<div class="loading-status">' +
    '<i class="fas fa-ban fa-spin"></i> ' +
    '<i class="fas fa-ban fa-spin"></i> ' +
    '<i class="fas fa-ban fa-spin"></i>' +
    '<h2 class="message"></h2>' +
    '</div>' +
    '</div>');

let hideContent = () => {
    return new Promise((resolve) => {
        let page = $('html');
        page.hide();
        $(document).ready(() => {
            let body = $('body');
            body.css('overflow', 'hidden');
            for (let font of fonts) {
                container.append($(font));
            }
            page.prepend(container);
            page.show();
            setTimeout(() => { // Allow time for fonts to load
                updateLoadingMessage('[1] Reading page...');
                container.append(loading);
                loading.show(); // Fail safe.
                resolve();
            }, 500);
        });
    });
};

let updateLoadingMessage = (message) => loading.find('.message').html(message);
let hideLoadingScreen = () => loading.hide();
let showLoadingScreen = () => loading.show();

export {hideContent, updateLoadingMessage, hideLoadingScreen, showLoadingScreen};
