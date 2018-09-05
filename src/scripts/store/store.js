import {createStore} from 'redux';
import {bpState, getInitialState} from './reducers';

import {
    setEnabled,
    setScanLoading,
    setScanMessage,
} from './actions';

const mapFromStorage = {
    'enabled': setEnabled,
    'scan': {
        'loading': setScanLoading,
        'message': setScanMessage,
    },
};

/**
 * Create Store From Local Storage
 *
 * @return {Promise<any>}
 */
export function createStoreFromLocalStorage() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(Object.keys(mapFromStorage), (localStorage) => {
            let state = getInitialState();
            for (let key in mapFromStorage) {
                if (mapFromStorage.hasOwnProperty(key)) {
                    if (typeof localStorage[key] !== 'undefined') {
                        let assign = {};
                        assign[key] = typeof localStorage[key] === 'object' ?
                            Object.assign({}, localStorage[key])
                            : localStorage[key];
                        state = Object.assign(state, assign);
                    }
                }
            }
            let store = createStore(bpState, state);
            // Add local storage listener
            chrome.storage.onChanged.addListener((changes) => {
                for (let key in changes) {
                    if (changes.hasOwnProperty(key) && typeof mapFromStorage[key] !== 'undefined') {
                        applyToStoreFromLocalStorage(store, mapFromStorage[key], changes[key].newValue);
                    }
                }
            });
            resolve(store);
        });
    });
}

/**
 * Apply To Store From Local Storage
 *
 * @param {object} store
 * @param {object|string} storageFunction
 * @param {*} value
 */
function applyToStoreFromLocalStorage(store, storageFunction, value) {
    if (typeof storageFunction === 'function') {
        store.dispatch(storageFunction(value, 'storage'));
    } else {
        for (let key in storageFunction) {
            if (storageFunction.hasOwnProperty(key) && typeof value[key] !== 'undefined') {
                applyToStoreFromLocalStorage(store, storageFunction[key], value[key]);
            }
        }
    }
}
