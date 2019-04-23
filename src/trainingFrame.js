/**
 * TrainingFrame.js
 *
 * This script is included in the iFrame overlay that is injected into the page when training model.
 */

import $ from 'jquery';

$(document).ready(function() {
    const actionsElement = $('#bp_training .actions');

    actionsElement.on('click', '#actionMarkSafe', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, {trigger: 'closeTrainingFrame'});
            chrome.tabs.sendMessage(tab.id, {trigger: 'markContentSafe'});
        });
    });

    actionsElement.on('click', '#actionMarkHarmful', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, {trigger: 'markContentHarmful'});
            $('#actionClose').show();
            $('.training-action').hide();
        });
    });

    actionsElement.on('click', '#actionHideTrainingFrame', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, {trigger: 'closeTrainingFrame'});
        });
    });

    actionsElement.on('click', '#actionClose', function() {
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.remove(tab.id);
        });
    });
});
