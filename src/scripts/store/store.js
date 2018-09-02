import {createStore} from 'redux';
import {bpState} from './reducers';
import {setEnabled, setLoading, setMessage} from './actions';

/**
 * Load State From Local Storage
 *
 * @param {*} store
 * @return {Promise<any>}
 */
export function loadStateFromLocalStorage(store) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['bpEnabled', 'bpLoading', 'bpMessage'], (result) => {
            /**
             * OnLoad - Check local storage, only parse content if the protection is enabled.
             */
            if (typeof result.bpEnabled !== 'undefined') {
                store.dispatch(setEnabled(result.bpEnabled));
            }
            if (typeof result.bpLoading !== 'undefined') {
                store.dispatch(setLoading(result.bpLoading));
            }
            if (typeof result.bpMessage !== 'undefined') {
                store.dispatch(setMessage(result.bpMessage));
            }
            resolve();
        });
    });
}

// Create and export store
const store = createStore(bpState);
export default store;
