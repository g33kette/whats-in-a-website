import $ from 'jquery';

// Initial load, get status
getStatusFromStorage(showStatus);

// Register DOM interaction on ready
$(document).ready(function() {
    $('body').on('click', '.bp-status-toggle', () => {
        getStatusFromStorage((bpEnabled) => {
            setStatusInStorage(!bpEnabled, showStatus);
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

/**
 * Get Status From Storage
 *
 * @param {function} callback(bpEnabled)
 */
function getStatusFromStorage(callback) {
    chrome.storage.sync.get(['bpEnabled'], function(result) {
        callback(result.bpEnabled);
    });
}

/**
 * Set Status In Storage
 *
 * @param {boolean} enabled
 * @param {function} callback(bpEnabled)
 */
function setStatusInStorage(enabled, callback) {
    chrome.storage.sync.set({bpEnabled: enabled}, function() {
        callback(enabled);
    });
}
