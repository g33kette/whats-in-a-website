/**
 * Menu.js
 *
 * This script is included in the Browser Protect menu, triggered by clicking the button on the chrome menu bar.
 * Allows extension options to be configured like logging in, enabling etc.
 */

import $ from 'jquery';

$(document).ready(function() {
    // Bind Event Listeners
    const body = $('body');
    body.on('submit', '.bp-menu-login', (e) => {
        login();
        e.preventDefault();
        return false;
    });
    body.on('click', '.bp-menu-status-toggle', () => {
        toggleStatus();
    });

    // On-Load:
    showAuthenticatedStatus();
});

/**
 * Show Authenticated Status
 */
function showAuthenticatedStatus() {
    chrome.runtime.sendMessage({get: 'username'}, (username) => {
        if (username) {
            $('.bp-menu-authenticated').show();
            $('.bp-menu-unauthenticated').hide();
        } else {
            $('.bp-menu-authenticated').hide();
            $('.bp-menu-unauthenticated').show();
        }
        // chrome.browserAction.setIcon(details)
        refreshStatus();
    });
}

/**
 * Login
 */
function login() {
    chrome.runtime.sendMessage({
        trigger: 'authenticate',
        params: {username: 'bob', password: 'secret'}, // todo
    }, () => {
        showAuthenticatedStatus();
    });
}

/**
 * Refresh Status
 */
function refreshStatus() {
    chrome.runtime.sendMessage({get: 'enabled'}, (enabled) => {
        updateStatusDisplay(enabled);
    });
}

/**
 * Toggle Status
 */
function toggleStatus() {
    chrome.runtime.sendMessage({trigger: 'toggleEnabled'}, (enabled) => {
        updateStatusDisplay(enabled);
    });
}

/**
 * Show Status
 *
 * @param {boolean} enabled
 */
function updateStatusDisplay(enabled) {
    let statusTag = $('.bp-menu-status-tag');
    let toggleStatusButton = $('.bp-menu-status-toggle');
    if (enabled) {
        statusTag.removeClass('tag-disabled').addClass('tag-success').text('Enabled');
        toggleStatusButton.text('Disable');
    } else {
        statusTag.removeClass('tag-success').addClass('tag-disabled').text('Disabled');
        toggleStatusButton.text('Enable');
    }
}

