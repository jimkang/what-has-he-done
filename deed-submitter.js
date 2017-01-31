var sb = require('standard-bail')();
var YAML = require('yamljs');
var waterfall = require('async-waterfall');
var curry = require('lodash.curry');
var callNextTick = require('call-next-tick');

const dataFilename = 'deeds.yaml';

function DeedSubmitter({
    githubAPIBase = 'https://api.github.com',
    shouldSetUserAgent = false,
    branch = 'proposed',
    gitRepoOwner = 'jimkang',
    gitToken,
    repo = 'what-has-he-done-data',
    request,
    encodeInBase64,
    decodeFromBase64
  }) {

  const urlBase =  `${githubAPIBase}/repos/${gitRepoOwner}/${repo}/contents`;

  return {
    submitDeed: submitDeed,
    getDeeds: getDeeds
  };

  function submitDeed(deed, done) {
    waterfall(
      [
        getDeeds,
        curry(addToDeeds)(deed),
        commitUpdatedDeeds
      ],
      done
    );
    // Get existing list
    // Append to list
    // Commit new list in branch    
  }

  function getDeeds(done) {
    var reqOpts = {
      url: `${urlBase}/${dataFilename}?access_token=${gitToken}`,
      method: 'GET'
    };

    if (branch) {
      reqOpts.url += '&ref=' + branch;
    }

    if (shouldSetUserAgent) {
      reqOpts.headers = {
        'User-Agent': 'add-deed'
      };
    }
    request(reqOpts, sb(parseGetResponse, done));
  }

  function addToDeeds(newDeed, deedResult, done) {
    deedResult.deeds.push(newDeed);
    callNextTick(done, null, deedResult);
  }

  function commitUpdatedDeeds({comment, sha, deeds}, done) {
    deeds.forEach(stringifyDeedDates);
    var deedsEncoded = encodeInBase64(YAML.stringify(deeds, 10, 2));

    var reqOpts = {
      url: `${urlBase}/${dataFilename}?access_token=${gitToken}`,
      json: true,
      method: 'PUT',
      body: {
        message: comment ? comment : 'Update from add-deed app.',
        content: deedsEncoded,
        branch: branch,
        sha: sha
      }
    };

    if (shouldSetUserAgent) {
      reqOpts.headers = {
        'User-Agent': 'add-deed'
      };
    }
    request(reqOpts, sb(parsePutResponse, done));
  }

  function parseGetResponse(res, body, done) {
    if (res.statusCode === 404) {
      // No error; there's just no list.
      done(null, []);
    }
    else if (res.statusCode === 200) {
      var parsed = JSON.parse(body);
      var result = {
        sha: parsed.sha,
        deeds: YAML.parse(decodeFromBase64(parsed.content))
      };
      done(null, result);
    }
    else {
      done(new Error('Unknown error: ' + res.statusCode + ', ' + JSON.stringify(body)));
    }
  }
}

function parsePutResponse(res, body, done) {
  if (res.statusCode === 201 || res.statusCode === 200) {
    done();
  }
  else {
    done(new Error('Failed to update file: ' + res.statusCode + ', ' + JSON.stringify(body)));
  }
}

function stringifyDeedDates(deed) {
  if (!deed.stamp || (typeof deed.stamp !== 'object' && typeof deed.stamp !== 'string')) {
    deed.stamp = (new Date()).toISOString();
  }
  else if (typeof deed.stamp.toISOString === 'function') {
    deed.stamp = deed.stamp.toISOString();
  }
  else if (typeof deed.stamp.toString === 'function') {
    deed.stamp = deed.stamp.toString();
  }
}

module.exports = DeedSubmitter;
