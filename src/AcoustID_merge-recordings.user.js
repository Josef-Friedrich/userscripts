// Origin: https://github.com/loujine/musicbrainz-scripts/blob/master/acoustid-merge-recordings.user.js

/* globals $ */
'use strict'
// ==UserScript==
// @name         MusicBrainz: Merge recordings from the AcoustID track page (https://acoustid.org/track/…)
// @namespace    josef-friedrich
// @author       loujine, Josef Friedrich
// @version      0.5.0
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
 * https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting
 */
const RATE_LIMIT = 1000

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
function assembleEntityLookupUrl (recordingId) {
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

function mergeSelected () {
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
          timeout: RATE_LIMIT,
          onload: response => {
            document.getElementById(
              'merge-text'
            ).textContent = `Fetched internal ID for the recording ${index}`
            ids.push(JSON.parse(response.responseText).id)
          }
        })
      }, RATE_LIMIT * index)
    })
  setTimeout(function () {
    const url = assembleMergeUrl(ids)
    document.getElementById('merge-text').textContent = 'Opening merge page'
    window.open(url)
  }, document.querySelectorAll('.mbmerge:checked').length * RATE_LIMIT +
    RATE_LIMIT)
}

function checkAllAndMergeAll () {
  checkAll()
  mergeSelected()
}

/**
 * Linked MusicBrainz recordings table
 */
const tableElement = document.getElementsByTagName('table')[1]

/**
 * ## Row without title and artist
 *
 * ```html
 * <tr id="434901a2-ca49-495c-ae40-748e03c55fac">
 *   <td colspan="3"><i><a href="//musicbrainz.org/recording/43…">434901a2…</a></i></td>
 *   <td>1</td>
 * </tr>
 * ```
 *
 * ## Row with title and artist
 *
 * ```html
 * <tr id="bdb59eed-c08e-4a3d-973e-445185a6cdf0">
 *   <td><a href="//musicbrainz.org/recording/bd…">I Just Called To Say I Love You</a></td>
 *   <td>Stevie Wonder</td>
 *   <td>4:23</td>
 *   <td>1</td>
 * </tr>
 * ```
 *
 * ## Row disabled
 *
 * ```html
 * <tr class="mbid-disabled" id="66849885-1d7a-4778-8d87-67915bdf2016">
 *   <td><a href="//musicbrainz.org/recording/66…">Creepin’</a></td>
 *   <td>Stevie Wonder</td>
 *   <td>4:20</td>
 *   <td>42</td>
 * </tr>
 * ```
 */
function addCheckboxes () {
  tableElement.querySelectorAll('tr').forEach(tableRowElement => {
    const mbid = tableRowElement.id
    if (mbid !== '') {
      if (tableRowElement.classList.contains('mbid-disabled')) {
        tableRowElement.insertAdjacentHTML('afterbegin', `<td></td>`)
      } else {
        tableRowElement.insertAdjacentHTML(
          'afterbegin',
          `<td><input class="mbmerge" value="${mbid}" type="checkbox"></td>`
        )
      }
    }
  })
}

function addTableHeader () {
  tableElement.children[0].children[0].insertAdjacentHTML(
    'afterbegin',
    `
      <th>Merge</th>
  `
  )
}

function addButtons () {
  tableElement.insertAdjacentHTML(
    'afterend',
    `
      <input id="check-all" value="Select all" type="button">
      <input id="merge-selected" value="Merge selected" type="button">
      <input id="merge-all" value="Merge all" type="button">
      <span id="merge-text"></span>
    `
  )
}

function addHtmlElements () {
  addCheckboxes()
  addTableHeader()
  addButtons()
}

addHtmlElements()

$(document).ready(function () {
  document.getElementById('check-all').addEventListener('click', checkAll)
  document
    .getElementById('merge-selected')
    .addEventListener('click', mergeSelected)
  document
    .getElementById('merge-all')
    .addEventListener('click', checkAllAndMergeAll)
  return false
})
