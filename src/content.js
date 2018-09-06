import parseContent from './scripts/parseContent';
import {createStoreFromLocalStorage} from './scripts/store/store';
import {setProcessingMessage, setProcessingLoading, setRemoveFrame} from './scripts/store/actions';

createStoreFromLocalStorage().then((store) => {
    /* OnLoad - Check local storage, only parse content if the protection is enabled. */
    if (store.getState().enabled) {
        store.dispatch(setRemoveFrame(false)); // todo remove, this temporarily will reset
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
        store.dispatch(setProcessingMessage('Done.'));
        store.dispatch(setProcessingLoading(false));
        console.log('Contented.');
        // console.log(content);
    }, 2000);
}
