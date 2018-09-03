import {parseContent} from './scripts/contentProtect';
import {createStoreFromLocalStorage, subscribeToStoreChanges} from './scripts/store/store';
import {setSessionMessage} from './scripts/store/actions';

createStoreFromLocalStorage().then((store) => {
    subscribeToStoreChanges(store, (newState, debug) => {
        console.log('stateChanged content.js', newState, debug);
    });
    /**
     * OnLoad - Check local storage, only parse content if the protection is enabled.
     */
    if (store.getState().enabled) {
        parseContent(store).then((content) => finit(content, store));
    }
});

/**
 * Finit - WIP method after content is parsed
 *
 * @param {string} content
 * @param {object} store
 */
function finit(content, store) {
    setTimeout(() => { // Fakin' it.
        store.dispatch(setSessionMessage('Done.'));
        console.log('Contented.');
        // console.log(content);
    }, 2000);
}
