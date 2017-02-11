/* global $ _ requests sidebar */
'use strict';
// ==UserScript==
// @name         MusicBrainz: Shortcuts
// @namespace    mbz-joseffriedrich
// @author       Josef Friedrich
// @version      6
// @downloadURL  https://raw.githubusercontent.com/Josef-Friedrich/greasemonkey-user-scripts/master/mbz-shortcuts.user.js
// @updateURL    https://raw.githubusercontent.com/Josef-Friedrich/greasemonkey-user-scripts/master/mbz-shortcuts.user.js
// @supportURL   https://github.com/Josef-Friedrich/greasemonkey-user-scripts
// @icon         https://raw.githubusercontent.com/Josef-Friedrich/greasemonkey-user-scripts/master/icon.png
// @description  musicbrainz.org: Add some shortcuts
// @compatible   firefox+greasemonkey
// @licence      MIT (https://opensource.org/licenses/MIT)
// @include      http*://musicbrainz.org/release/*/edit-relationships
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

function AddShortCuts(id, key) {
    $("#" + id).attr("accesskey", key).attr("title", "Shortcut: " + key);
}

$(window).on("load", function() {
    AddShortCuts("batch-recording", "r");
});
