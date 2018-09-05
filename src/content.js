import {parseContent} from './scripts/contentProtect';
import {createStoreFromLocalStorage} from './scripts/store/store';
import {setScanMessage, setScanLoading} from './scripts/store/actions';

createStoreFromLocalStorage().then((store) => {
    /* OnLoad - Check local storage, only parse content if the protection is enabled. */
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
        store.dispatch(setScanMessage('Done.'));
        store.dispatch(setScanLoading(false));
        console.log('Contented.');
        // console.log(content);
    }, 2000);
}
