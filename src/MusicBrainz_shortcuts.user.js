/* global $ _ requests sidebar */
'use strict';
// ==UserScript==
// @name         MusicBrainz: Shortcuts
// @namespace    josef-friedrich
// @author       Josef Friedrich
// @description  Add keyboard shortcuts to navigation to important MusicBrainz pages.
// @version      10
// @downloadURL  https://github.com/Josef-Friedrich/userscripts/raw/main/src/MusicBrainz_shortcuts.user.js
// @updateURL    https://github.com/Josef-Friedrich/userscripts/raw/main/src/MusicBrainz_shortcuts.user.js
// @supportURL   https://github.com/Josef-Friedrich/userscripts
// @icon         https://raw.githubusercontent.com/Josef-Friedrich/userscripts/main/icon.png
// @description  musicbrainz.org: Add some shortcuts
// @compatible   firefox+greasemonkey
// @licence      MIT (https://opensource.org/licenses/MIT)
// @include      http*://musicbrainz.org/release/*/edit-relationships
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

function AddShortCuts(id, key) {
  var link = $('#' + id);
  link.bind('keydown', key, function() { this.click(); });
  link.attr({
    title: 'Shortcut: ' + key
  });
  var text = link.html();
  link.html(text + ' (' + key + ')');
}
AddShortCuts('batch-recording', 'r');
AddShortCuts('batch-create-works', 'n');
AddShortCuts('batch-work', 'w');
