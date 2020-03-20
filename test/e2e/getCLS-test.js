/*
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const assert = require('assert');
const {beaconCountIs, clearBeacons, getBeacons} = require('../utils/beacons.js');
const {browserSupportsEntry} = require('../utils/browserSupportsEntry.js');
const {imagesPainted} = require('../utils/imagesPainted.js');


describe('getCLS()', async function() {
  let browserSupportsCLS;
  before(async function() {
    browserSupportsCLS = await browserSupportsEntry('layout-shift');
  });

  beforeEach(async function() {
    await clearBeacons();
  });

  it('reports the correct value and entries on hidden', async function() {
    if (!browserSupportsCLS) this.skip();

    await browser.url('/test/cls');

    // Wait until all images are loaded and rendered.
    await imagesPainted();

    // Load a new page to trigger the hidden state.
    await browser.url('about:blank');

    await beaconCountIs(1);

    const [{cls}] = await getBeacons();
    assert.strictEqual(typeof cls.value, 'number');
    assert(cls.value >= 0);
    assert.strictEqual(cls.entries.length, 2);
  });
});
