var request = require('basic-browser-request');
var config = require('./config');
var sb = require('standard-bail')();
var callNextTick = require('call-next-tick');

const estimatedExpirationLengthInDays = 1;

// routeDict should be a dictionary derived from the URL route. It can be empty, but not undefined.
// store should be an object that behaves like localStorage. It can be empty, but not undefined.
function findToken({routeDict, store, currentDate}, done) {  
  if ('code' in routeDict) {
    var reqOpts = {
      method: 'POST',
      url: 'https://github.com/login/oauth/access_token?' +
        'client_id=' + config.github.clientId +
        '&client_secret=' + config.github.clientSecret +
        '&code=' + routeDict.code,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      },
      // body: {
      //   client_id: config.github.clientId,
      //   client_secret: config.github.clientSecret,
      //   code: routeDict.code        
      // }
    };
    // request(reqOpts, sb(extractToken, done));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', reqOpts.url);
    xhr.onload = logIt;
    xhr.send();

    function logIt() {
      debugger;
    }

    return;
  }
  
  if (store.tokenInfo) {
    var tokenInfo = JSON.parse(store.tokenInfo);
    if (tokenInfo.expires > currentDate.getTime()) {
      callNextTick(done, null, tokenInfo.token);
      return;
    }
  }

  done(new Error('No token or code found.'));

  function extractToken(res, body) {
    var token;

    if (body && body.access_token) {
      token = body.access_token;
      store.tokenInfo = JSON.stringify({
        token: token,
        expires: currentDate.getTime() +
          estimatedExpirationLengthInDays * 24 * 60 * 60 * 1000
      });
    }

    if (token) {
      done(null, token);
    }
    else {
      done(new Error('Could not get the token from GitHub.'));
    }
  }
}

module.exports = findToken;
