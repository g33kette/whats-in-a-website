import {parseContent} from './scripts/contentProtect';
import store, {loadStateFromLocalStorage} from './scripts/store/store';
import {setMessage} from './scripts/store/actions';

store.subscribe(() => {
    console.log('stateChanged content.js', store.getState());
});

loadStateFromLocalStorage.then(() => {
    if (store.getState().enabled) {
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
        store.dispatch(setMessage('Done.'));
        console.log('Contented.');
        // console.log(content);
    }, 2000);
};
