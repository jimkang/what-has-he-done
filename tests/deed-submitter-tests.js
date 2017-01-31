/* global Buffer */

var test = require('tape');
var assertNoError = require('assert-no-error');
var DeedSubmitter = require('../deed-submitter');
var config = require('../config');
var curry = require('lodash.curry');

var request;

if (typeof window === 'object') {
  // Don't use the Node request module for the browser test!
  request = require('basic-browser-request');
}
else {
  request = require('request');
}


var encodeInBase64;
var decodeFromBase64;
 
if (typeof window === 'object' && window.btoa) {
  encodeInBase64 = function encodeInBase64(s) {
    return window.btoa(s);
  };
}
else {
  encodeInBase64 = function encodeFromBase64(s) {
    return Buffer.from(s, 'utf8').toString('base64');
  };
}

if (typeof window === 'object' && window.atob) {
  decodeFromBase64 = function decodeFromBase64(s) {
    return window.atob(s);
  };
}
else {
  decodeFromBase64 = function decodeFromBase64(s) {
    return Buffer.from(s, 'base64').toString('utf8');
  };
}

var randomId = require('idmaker').randomId;

var defaultCtorOpts = {
  gitRepoOwner: 'jimkang',
  gitToken: config.github.token,
  request: request,
  encodeInBase64: encodeInBase64,
  decodeFromBase64: decodeFromBase64,
  shouldSetUserAgent: true,
  branch: 'test'
};

var deeds = [];

for (var i = 0; i < 3; ++i) {
  deeds.push({
    name: 'Deed ' + randomId(14),
    stamp: (new Date()).toISOString(),
    description: 'A description with some random junk: ' + randomId(10),
    urls: [
      {
        name: 'Some news site ' + randomId(4),
        url: 'http://something.something/' + randomId(8)
      },
      {
        name: 'Some news site ' + randomId(4),
        url: 'http://something.something/' + randomId(8)
      }
    ],
    tags: [
      randomId(10),
      randomId(10),
      randomId(10)
    ]
  });
}

test('getDeeds', getDeedsTest);

deeds.forEach(runSubmitTest);
console.log('Please head over to https://github.com/jimkang/what-has-he-done-data/commits/test and manually inspect the commits created by these tests.');

function getDeedsTest(t) {
  var getDeeds = DeedSubmitter(defaultCtorOpts).getDeeds;
  getDeeds(checkRetrievedDeeds);

  function checkRetrievedDeeds(error, result) {
    assertNoError(t.ok, error, 'No error from getDeeds.');
    t.ok(result.sha, 'Result has a SHA.');
    t.ok(result.deeds.length > 0, 'There is at least one deed.');
    result.deeds.forEach(curry(checkDeed)(t));
    t.end();
  }
}

function runSubmitTest(deed) {
  test('Submitting ' + deed.name, submitTest);

  function submitTest(t) {
    var submitDeed = DeedSubmitter(defaultCtorOpts).submitDeed;
    submitDeed(deed, checkResult);

    function checkResult(error) {
      assertNoError(t.ok, error, 'No error from submitDeed.');
      t.end();
    }
  }
}

function checkDeed(t, deed) {
  t.ok(deed.name, 'Deed has a name.');
  t.ok(deed.stamp, 'Deed has a stamp.');
  // t.ok(deed.description, 'Deed has a description.');
  t.ok(Array.isArray(deed.urls), 'Deed has urls.');
  // t.ok(Array.isArray(deed.tags), 'Deed has tags.');
}
