/* global $ _ requests sidebar */
'use strict';
// ==UserScript==
// @name         MusicBrainz: Shortcuts
// @namespace    mbz-joseffriedrich
// @author       Josef Friedrich
// @version      2017.02.11
// @downloadURL  https://raw.githubusercontent.com/Josef-Friedrich/greasemonkey-user-scripts/master/mbz-shortcuts.user.js
// @updateURL    https://raw.githubusercontent.com/Josef-Friedrich/greasemonkey-user-scripts/master/mbz-shortcuts.user.js
// @supportURL   https://github.com/Josef-Friedrich/greasemonkey-user-scripts
// @icon         https://raw.githubusercontent.com/Josef-Friedrich/greasemonkey-user-scripts/master/icon.png
// @description  musicbrainz.org: Add some shortcuts
// @compatible   firefox+greasemonkey
// @licence      MIT (https://opensource.org/licenses/MIT)
// @include      http*://musicbrainz.org/release/*/edit-relationships
// @grant        none
// @run-at       document-end
// ==/UserScript==

$(document).ready(function() {
    $('.rel-add').click(function() {alert("Add!");});
    return false;
});
