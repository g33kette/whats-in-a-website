import {createStoreFromLocalStorage} from './scripts/store/store';
import $ from 'jquery';
import {setRemoveFrame} from './scripts/store/actions';
createStoreFromLocalStorage().then((store) => {
    let loadingElement;
    let messageElement;
    let completeElement;

    $(document).ready(function() {
        loadingElement = $('.loading');
        messageElement = $('.message');
        completeElement = $('.complete');

        completeElement.on('click', '#actionContinue', function() {
            store.dispatch(setRemoveFrame(true));
        });

        completeElement.on('click', '#actionClose', function() {
            chrome.tabs.getCurrent((tab) => {
                chrome.tabs.remove(tab.id);
            });
        });
    });

    let displayLoadingScreen = (loading) => {
        if (loading) {
            loadingElement.show();
            completeElement.hide();
        } else {
            loadingElement.hide();
            completeElement.show();
        }
    };
    let updateLoadingMessage = (message) => messageElement.html(message);

    store.subscribe(() => {
        displayLoadingScreen(store.getState().processing.loading);
        updateLoadingMessage(store.getState().processing.message);
    });
});


