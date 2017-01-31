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

//   {
//     name: 'Set rules for an artist that doesn\'t already have rules.',
//     method: 'setRules',
//     opts: {
//       artistHexId: artistIdA,
//       updatedRules: {
//         alwaysAtTop: [],
//         suppress: ['spotify:track:2JeaPqOw6FS7jz6ytEq7T3'],
//         alwaysInclude: [],
//         overrideDescription: ''
//       }
//     }
//   },

//   {
//     name: 'Get existing rules',
//     method: 'retrieveRules',
//     opts: {
//       artistHexId: artistIdA
//     },
//     shaIsExpected: true,
//     expectedRules: {
//       alwaysAtTop: [],
//       suppress: ['spotify:track:2JeaPqOw6FS7jz6ytEq7T3'],
//       alwaysInclude: [],
//       overrideDescription: ''
//     }
//   },

//   {
//     name: 'Get non-existent rules again',
//     method: 'retrieveRules',
//     opts: {
//       artistHexId: artistIdB
//     },
//     shaIsExpected: false,
//     expectedRules: {
//       alwaysAtTop: [],
//       suppress: [],
//       alwaysInclude: [],
//       overrideDescription: ''
//     }
//   },

//   {
//     name: 'Set rules for an artist that already has rules. NOTE: Check artistsets_editor_output repo to verify comment.',
//     method: 'setRules',
//     opts: {
//       artistHexId: artistIdA,
//       updatedRules: {
//         alwaysAtTop: [],
//         suppress: ['spotify:track:2JeaPqOw6FS7jz6ytEq7T3', 'spotify:track:3strFd69pYSysjtGpiYc8c'],
//         alwaysInclude: [],
//         overrideDescription: ''
//       },
//       comment: 'Update from rule-store-tests ' + (new Date()).toISOString()
//     }
//   },

//   {
//     name: 'Get existing rules again',
//     method: 'retrieveRules',
//     opts: {
//       artistHexId: artistIdA
//     },
//     shaIsExpected: true,
//     expectedRules: {
//       alwaysAtTop: [],
//       suppress: ['spotify:track:2JeaPqOw6FS7jz6ytEq7T3', 'spotify:track:3strFd69pYSysjtGpiYc8c'],
//       alwaysInclude: [],
//       overrideDescription: ''
//     }
//   }
// ];

// // if (typeof window === 'object') {
// //   test('Pause', function pauseHack(t) {
// //     window.c = t.end;
// //     // Call `c()` in the browser console when you're ready to continue.
// //   });
// // }

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
