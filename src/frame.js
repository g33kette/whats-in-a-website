import {createStoreFromLocalStorage} from './scripts/store/store';
import $ from 'jquery';
createStoreFromLocalStorage().then((store) => {
    let loadingElement;
    let messageElement;
    $(document).ready(function() {
        loadingElement = $('.loading');
        messageElement = $('.message');
    });
    let displayLoadingScreen = (loading) => loading?loadingElement.show():loadingElement.hide();
    let updateLoadingMessage = (message) => messageElement.html(message);

    store.subscribe(() => {
        displayLoadingScreen(store.getState().scan.loading);
        updateLoadingMessage(store.getState().scan.message);
    });
});


