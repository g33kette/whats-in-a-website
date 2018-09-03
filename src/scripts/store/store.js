import {createStore} from 'redux';
import {bpState, getInitialState} from './reducers';

const mapFromStorage = ['enabled', 'session'];

/**
 * Create Store From Local Storage
 *
 * @return {Promise<any>}
 */
export function createStoreFromLocalStorage() {
    console.log('createStoreFromLocalStorage');
    return new Promise((resolve) => {
        chrome.storage.sync.get(mapFromStorage, (localStorage) => {
            let state = getInitialState();
            for (let key of mapFromStorage) {
                if (typeof localStorage[key] !== 'undefined') {
                    let assign = {};
                    assign[key] = typeof localStorage[key] === 'object'?
                        Object.assign({}, localStorage[key])
                        :localStorage[key];
                    state = Object.assign(state, assign);
                }
            }
            console.log('createStore', state);
            resolve(createStore(bpState, state));
        });
    });
}

/**
 * Subscribe To Store Changes
 *
 * @param {object} store
 * @param {function} callback
 */
export function subscribeToStoreChanges(store, callback) {
    store.subscribe(() => callback(store.getState(), 'storeChange'));
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (let key in changes) {
            if (changes.hasOwnProperty(key) && mapFromStorage.indexOf(key) >= 0) {
                let change = {};
                change[key] = changes[key].newValue;
                callback(change, 'localStorageChange');
            }
        }
    });
}
