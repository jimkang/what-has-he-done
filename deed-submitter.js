var sb = require('standard-bail')();
var waterfall = require('async-waterfall');
var curry = require('lodash.curry');
var callNextTick = require('call-next-tick');
var randomId = require('idmaker').randomId;

const dataFilename = 'deeds.yaml';

function DeedSubmitter({
    githubAPIBase = 'https://api.github.com',
    shouldSetUserAgent = false,
    sourceBranch = 'gh-pages',
    gitRepoOwner = 'jimkang',
    gitToken,
    repo = 'what-has-he-done-data',
    request,
    encodeInBase64,
    decodeFromBase64,
    jsyaml
  }) {

  const urlBase =  `${githubAPIBase}/repos/${gitRepoOwner}/${repo}/contents`;

  return {
    submitDeed: submitDeed,
    getDeeds: getDeeds
  };

  function getDeeds(done) {
    var reqOpts = {
      url: `${urlBase}/${dataFilename}?access_token=${gitToken}`,
      method: 'GET'
    };
    // console.log('Get from:', reqOpts.url);

    if (sourceBranch) {
      reqOpts.url += '&ref=' + sourceBranch;
    }

    if (shouldSetUserAgent) {
      reqOpts.headers = {
        'User-Agent': 'add-deed'
      };
    }
    request(reqOpts, sb(parseGetResponse, done));
  }

  function submitDeed(deed, done) {
    var branchName = 'deed-' + randomId(8);
    var deedResult;

    waterfall(
      [
        getDeeds,
        saveDeedResult,
        curry(addToDeeds)(deed),
        getBranch,
        createBranch,
        commitUpdatedDeeds,
        createPullRequest
      ],
      done
    );

    function saveDeedResult(theDeedResult, done) {
      deedResult = theDeedResult;
      callNextTick(done);
    }

    function addToDeeds(newDeed, done) {
      deedResult.deeds.push(newDeed);
      callNextTick(done);
    }

    function commitUpdatedDeeds(done) {
      deedResult.deeds.forEach(sanitizeDeedsForDumping);
      var deedsEncoded = encodeInBase64(jsyaml.safeDump(deedResult.deeds));

      var reqOpts = {
        url: `${urlBase}/${dataFilename}?access_token=${gitToken}`,
        json: true,
        method: 'PUT',
        body: {
          message: deedResult.comment ? deedResult.comment : 'Update from add-deed app.',
          content: deedsEncoded,
          branch: branchName,
          sha: deedResult.sha
        }
      };

      if (shouldSetUserAgent) {
        reqOpts.headers = {
          'User-Agent': 'add-deed'
        };
      }
      // console.log('Commiting update with request:', JSON.stringify(reqOpts, null, '  '));

      request(reqOpts, sb(parsePutResponse, done));
    }

    function getBranch(done) {
      var reqOpts = {
        url:  `${githubAPIBase}/repos/${gitRepoOwner}/${repo}/git/refs/heads/${sourceBranch}?access_token=${gitToken}`,
        method: 'GET',
        json: true
      };
      if (shouldSetUserAgent) {
        reqOpts.headers = {
          'User-Agent': 'add-deed'
        };
      }
      // console.log('Finding branch with URL', reqOpts.url);
      request(reqOpts, sb(parseGetBranchResponse, done));
    }

    function createBranch(baseBranchSHA, done) {
      var reqOpts = {
        url: `${githubAPIBase}/repos/${gitRepoOwner}/${repo}/git/refs`,
        json: true,
        method: 'POST',
        headers: {
          Authorization: `token ${gitToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          ref: 'refs/heads/' + branchName,
          sha: baseBranchSHA
        }
      };

      if (shouldSetUserAgent) {
        reqOpts.headers['User-Agent'] = 'add-deed';
      }

      // console.log('Creating branch with request:', JSON.stringify(reqOpts, null, '  '));
      request(reqOpts, sb(parseCreateBranchResponse, done));
    }

    function parseGetBranchResponse(res, body, done) {
      if (res.statusCode === 200) {
        done(null, body.object.sha);
      }
      else {
        done(new Error(
          `Could not get ${branchName} branch: ${res.statusCode}, ${JSON.stringify(body)}`
        ));
      }
    }

    function parseCreateBranchResponse(res, body, done) {
      if (res.statusCode === 201) {
        done();
      }
      else {
        done(new Error(
          `Could not create ${branchName} branch: ${res.statusCode}, ${JSON.stringify(body)}`
        ));
      }
    }

    function createPullRequest(done) {
      var reqOpts = {
        url: `${githubAPIBase}/repos/${gitRepoOwner}/${repo}/pulls?access_token=${gitToken}`,
        json: true,
        method: 'POST',
        body: {
          title: 'New deed ' + branchName,
          head: branchName,
          base: 'gh-pages',
          body: 'New deed submission'
        }
      };

      if (shouldSetUserAgent) {
        reqOpts.headers = {
          'User-Agent': 'add-deed'
        };
      }
      request(reqOpts, sb(parsePullRequestResponse, done));
    }

    function parsePullRequestResponse(res, body, done) {
      if (res.statusCode === 201) {
        done(null, body.url);
      }
      else {
        done(new Error(
          `Could not create pull request for ${branchName} branch: ${res.statusCode}, ${JSON.stringify(body)}`
        ));
      }
    }
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
        deeds: jsyaml.safeLoad(decodeFromBase64(parsed.content))
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

function sanitizeDeedsForDumping(deed) {
  if (!deed.stamp || (typeof deed.stamp !== 'object' && typeof deed.stamp !== 'string')) {
    deed.stamp = (new Date()).toISOString();
  }
  else if (typeof deed.stamp.toISOString === 'function') {
    deed.stamp = deed.stamp.toISOString();
  }
  else if (typeof deed.stamp.toString === 'function') {
    deed.stamp = deed.stamp.toString();
  }

  if (!deed.description) {
    delete deed.description;
  }
}

module.exports = DeedSubmitter;
