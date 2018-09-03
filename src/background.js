
import {getEmptySession} from './scripts/store/reducers';

/**
 * Clear local storage session on start up
 */
chrome.runtime.onStartup.addListener(function() {
    // todo this is not firing, actually want it to reset on each page load. maybe should rename it to something
    // todo that's not session?
    console.log('clear session');
    chrome.storage.sync.set({session: getEmptySession()});
});

//
//

chrome.webNavigation.onCommitted.addListener(function(details) {
        // https://developer.chrome.com/extensions/content_scripts

        // // console.log(JSON.stringify(details));
        // let headers = details.requestHeaders;
        // let blockingResponse = {};
        //
        // // Each header parameter is stored in an array. Since Chrome
        // // makes no guarantee about the contents/order of this array,
        // // you'll have to iterate through it to find for the
        // // 'User-Agent' element
        // for (let i = 0, l = headers.length; i < l; ++i ) {
        //     if (headers[i].name === 'User-Agent') {
        //         headers[i].value = '>>> Your new user agent string here <<<';
        //         console.log(headers[i].value);
        //         break;
        //     }
        //     // If you want to modify other headers, this is the place to
        //     // do it. Either remove the 'break;' statement and add in more
        //     // conditionals or use a 'switch' statement on 'headers[i].name'
        // }
        //
        // blockingResponse.requestHeaders = headers;
        // return blockingResponse;
        // chrome.webNavigation.getAllFrames(object details, function callback)
        // todo console.log('details', details.url);
        // todo chrome.webNavigation.getFrame({tabId: details.tabId, frameId: details.frameId}, (frame) => {
        // todo     console.log('frame', frame);
        // todo });
        // console.log('content', details);
        // alert('details', details);
        // alert('url', details.url);
        return {cancel: true};
        // return {cancel: details.url.indexOf('://*.bbc.co.uk/*') !== -1};
    },
    {urls: ['*://*.bbc.co.uk/*']},
    ['requestHeaders', 'blocking']
);
// chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
//         // // console.log(JSON.stringify(details));
//         // let headers = details.requestHeaders;
//         // let blockingResponse = {};
//         //
//         // // Each header parameter is stored in an array. Since Chrome
//         // // makes no guarantee about the contents/order of this array,
//         // // you'll have to iterate through it to find for the
//         // // 'User-Agent' element
//         // for (let i = 0, l = headers.length; i < l; ++i ) {
//         //     if (headers[i].name === 'User-Agent') {
//         //         headers[i].value = '>>> Your new user agent string here <<<';
//         //         console.log(headers[i].value);
//         //         break;
//         //     }
//         //     // If you want to modify other headers, this is the place to
//         //     // do it. Either remove the 'break;' statement and add in more
//         //     // conditionals or use a 'switch' statement on 'headers[i].name'
//         // }
//         //
//         // blockingResponse.requestHeaders = headers;
//         // return blockingResponse;
//         console.log('url', details.url);
//         alert('url', details.url);
//         return {cancel: details.url.indexOf('://*.bbc.co.uk/*') !== -1};
//     },
//     {urls: ['<all_urls>']},
//     ['requestHeaders', 'blocking']
// );

// import $ from 'jquery';

// console.log('Hello from your Chrome extension!');
//
// chrome.webRequest.onBeforeRequest.addListener(() => {
//         console.log('beforeRequest Listener');
//     },
//     {urls: ['*://www.bbc.co.uk/*']},
//     ['blocking']
//     // , filter, opt_extraInfoSpec
// );


// let html = document.getElementsByTagName('html');
// html[0].innerHTML = 'Testing 1 2 3.';

// $(document).ready(function() {
//     let style = [
//         'width: 100%;',
//         'height: 100%;',
//         'z-index:1000;',
//         'background-color: rgba(0, 255, 0, 0.6);',
//         'position: absolute;',
//     ];
//     let cover = $('<div style="'+style.join(' ')+'"><h1 style="text-align: center">WARNING</h1></div>');
//     // console.log('cover', cover);
//     let content = $('<pre ' +
//  'style="width: 80%; height: 60vh; overflow: auto; margin: auto; background-color: rgba(255, 255, 0, 0.6);" />');
//     content.text($('body').text());
//     cover.append(content);
//     // console.log('content', content);
//     $('html').prepend(cover);// .css('height', '100%');
//     $('body').hide();
// });


// "background_ignore": [
//     {
//         "todo I think this should be replace the content load bit below":"",
//         "matches": ["<all_urls>"],
//         "js": ["background.js"]
//     }
// ],
//     "content_scripts_ignore": [
//     {
//         "matches": [
//             "<all_urls>"
//         ],
//         "js": ["background.js"]
//     }
// ],
