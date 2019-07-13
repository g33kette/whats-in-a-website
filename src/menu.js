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
        login($('#username').val(), $('#password').val());
        e.preventDefault();
        return false;
    });
    body.on('click', '.bp-menu-status-toggle', () => {
        toggleStatus();
    });
    body.on('click', '.bp-menu-clear-state-action', () => {
        if (confirm(
            'Are you sure you want to reset the extension and clear ALL data?' +
            'This cannot be undone and you will need to re-train the extension from scratch.'
        )) {
            clearData();
        }
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
 *
 * @param {string} username
 * @param {string} password
 */
function login(username, password) {
    chrome.runtime.sendMessage({
        trigger: 'authenticate',
        params: {username: username, password: password},
    }, () => {
        showAuthenticatedStatus();
        refreshStatus();
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

/**
 * Clear Data
 */
function clearData() {
    chrome.runtime.sendMessage({trigger: 'clearData'});
}

