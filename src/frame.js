import store from './scripts/store/store';
import $ from 'jquery';

let loader = $('.loading');

console.log('loader', loader.outerHtml);
console.log('state', store.getState());

store.subscribe(() => {
    console.log('stateChanged frame.js', store.getState());
    displayLoadingScreen(store.getState().loading);
    updateLoadingMessage(store.getState().message);
});

let displayLoadingScreen = (loading) => loading?loader.show():loader.hide();
let updateLoadingMessage = (message) => loader.find('.message').html(message);
