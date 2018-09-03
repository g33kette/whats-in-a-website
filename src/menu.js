import $ from 'jquery';
import {createStoreFromLocalStorage, subscribeToStoreChanges} from './scripts/store/store';
import {setEnabled} from './scripts/store/actions';

createStoreFromLocalStorage().then((store) => {
    subscribeToStoreChanges(store, (newState, debug) => {
        // alert('stateChanged menu.js '+debug);
    });
    // Initial load, get status
    showStatus(store.getState().enabled);
    // Register DOM interaction on ready
    $(document).ready(function() {
        $('body').on('click', '.bp-status-toggle', () => {
            let enabled = !store.getState().enabled;
            store.dispatch(setEnabled(enabled));
            showStatus(enabled);
        });
    });
});

/**
 * Show Status
 *
 * @param {boolean} enabled
 */
function showStatus(enabled) {
    let statusTag = $('.bp-status-tag');
    let toggleStatusButton = $('.bp-status-toggle');
    if (enabled) {
        statusTag.removeClass('tag-disabled').addClass('tag-success').text('Enabled');
        toggleStatusButton.text('Disable');
    } else {
        statusTag.removeClass('tag-success').addClass('tag-disabled').text('Disabled');
        toggleStatusButton.text('Enable');
    }
}

