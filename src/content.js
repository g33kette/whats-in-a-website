import {parseContent} from './scripts/contentProtect';
import {updateLoadingMessage} from './scripts/contentInterface';
import $ from 'jquery';

/**
 * OnLoad - Check local storage, only parse content if the protection is enabled.
 */
chrome.storage.sync.get(['bpEnabled'], function(result) {
    if (result.bpEnabled) {
        parseContent().then(finit);
    }
});

/**
 * Finit - WIP method after content is parsed
 *
 * @param {string} content
 */
let finit = (content) => {
    setTimeout(() => { // Fakin' it.
        updateLoadingMessage('Done.');
        $('#bp .loading')
            .append($('<textarea style="position: relative; width: 80%; height: 30vh; margin-top: 25%;" />')
                .text(content));
        console.log('Contented.');
    }, 2000);
};
