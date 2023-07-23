// Origin: https://github.com/loujine/musicbrainz-scripts/blob/master/acoustid-merge-recordings.user.js

/* globals $ */
'use strict'
// ==UserScript==
// @name         MusicBrainz: merge recordings from acoustID page
// @namespace    josef-friedrich
// @author       loujine, Josef Friedrich
// @version      0.3.0
// @downloadURL  https://github.com/Josef-Friedrich/userscripts/raw/main/src/AcoustID_merge-recordings.user.js
// @updateURL    https://github.com/Josef-Friedrich/userscripts/raw/main/src/AcoustID_merge-recordings.user.js
// @supportURL   https://github.com/Josef-Friedrich/userscripts
// @description  musicbrainz.org: merge recordings from acoustID page
// @compatible   firefox+tampermonkey
// @license      MIT
// @icon         https://raw.githubusercontent.com/Josef-Friedrich/userscripts/main/icon.png
// @include      http*://acoustid.org/track/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

// Multiple recordings
// https://acoustid.org/track/d438a663-ef5e-4c89-bcae-6a5f53ea94b2

// Single recording
// https://acoustid.org/track/7c64a5ef-e3a0-47fd-853a-4432d705a59e

/**
 * Result from `https://musicbrainz.org/ws/js/entity/887cf84f-d47c-4963-8b66-2ce71257815a`
 *
 * ```JSON
 * {
 *   "artist": "[unknown]",
 *   "entityType": "recording",
 *   "id": 35433317,
 *   "gid": "887cf84f-d47c-4963-8b66-2ce71257815a",
 *   "last_updated": "2023-07-09T04:27:49Z",
 *   "comment": "",
 *   "video": false,
 *   "length": 51000,
 *   "name": "Einstürzende Neubauten: Headcleaner (A)"
 * }
 * ```
 *
 * @param {string} recordingId - A MusicBrainz Identifer (MBID or UUID)
 *
 * @return {string} - For example `https://musicbrainz.org/ws/js/entity/887cf84f-d47c-4963-8b66-2ce71257815a`
 */
function assembleEntityLookupUrl(recordingId) {
  return `https://musicbrainz.org/ws/js/entity/${recordingId}`
}

/**
 * Example
 *
 * 1. `Einstürzende Neubauten: Headcleaner (A)` (`887cf84f-d47c-4963-8b66-2ce71257815a`) -> id: `35433317`
 * 2. `Pierre Schaeffer: Etudes aux allures (Schluss)` (`43a72d6f-e901-430d-9c88-46d58412162b `) -> id: `35433318`
 *
 * `https://musicbrainz.org/recording/merge_queue?add-to-merge=35433317&add-to-merge=35433318`
 *
 * @param {number[]} ids
 *
 * @returns {string}
 */
function assembleMergeUrl (ids) {
  return (
    'https://musicbrainz.org/recording/merge_queue?add-to-merge=' +
    ids.join('&add-to-merge=')
  )
}

function checkAll () {
  document.querySelectorAll('.mbmerge').forEach(function (node) {
    node.checked = true
  })
}

function launchMerge () {
  /**
   * @type {string[]}
   */
  const ids = []
  if (document.querySelectorAll('.mbmerge:checked').length < 2) {
    document.getElementById('merge-text').textContent =
      'You must merge at least two recordings'
    return
  }
  document
    .querySelectorAll('.mbmerge:checked')
    .forEach((checkboxElement, index) => {
      setTimeout(() => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: assembleEntityLookupUrl(checkboxElement.value),
          timeout: 1000,
          onload: response => {
            document.getElementById(
              'merge-text'
            ).textContent = `Fetched internal id for recording ${index}`
            ids.push(JSON.parse(response.responseText).id)
          }
        })
      }, 1000 * index)
    })
  setTimeout(function () {
    const url = assembleMergeUrl(ids)
    document.getElementById('merge-text').textContent = 'Opening merge page'
    console.log('Merge URL is ' + url)
    window.open(url)
  }, document.querySelectorAll('.mbmerge:checked').length * 1000 + 1000)
}

;(function displayButtons () {
  document
    .getElementsByTagName('table')[1]
    .children[0].children[0].insertAdjacentHTML(
      'afterbegin',
      `
        <th>Merge selection
          <input id="checkAll" value="Select all" type="button">
        </th>
    `
    )
  document.querySelectorAll('table a[href*="/recording/"]').forEach(node => {
    const mbid = node.href.split('/')[4]
    const tr = node.parentElement.parentElement
    if (
      // node.parentElement.tagName != 'I' && // Italic when recording title is displayed only as an UUID
      !tr.classList.contains('mbid-disabled')
    ) {
      tr.insertAdjacentHTML(
        'afterbegin',
        `<td><input class="mbmerge" value="${mbid}" type="checkbox"></td>`
      )
    }
  })
  document.getElementsByTagName('table')[1].insertAdjacentHTML(
    'afterend',
    `
        <input id="merge" value="Launch merge in MusicBrainz" type="button">
        <span id="merge-text"></span>
    `
  )
})()

$(document).ready(function () {
  document.getElementById('checkAll').addEventListener('click', checkAll)
  document.getElementById('merge').addEventListener('click', launchMerge)
  return false
})
