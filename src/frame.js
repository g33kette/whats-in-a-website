import {createStoreFromLocalStorage, subscribeToStoreChanges} from './scripts/store/store';
import $ from 'jquery';

let loader = $('.loading');

createStoreFromLocalStorage().then((store) => {
    let displayLoadingScreen = (loading) => loading?loader.show():loader.hide();
    let updateLoadingMessage = (message) => loader.find('.message').html(message);

    console.log('loader', loader.outerHtml);
    console.log('state', store.getState());

    subscribeToStoreChanges(store, (newState, debug) => {
        console.log('stateChanged frame.js', newState, debug, store.getState());
        displayLoadingScreen(store.getState().loading);
        updateLoadingMessage(store.getState().message);
    });
});


