var request = require('basic-browser-request');
var sb = require('standard-bail')();
var callNextTick = require('call-next-tick');

const estimatedExpirationLengthInDays = 1;

// routeDict should be a dictionary derived from the URL route. It can be empty, but not undefined.
// store should be an object that behaves like localStorage. It can be empty, but not undefined.
function findToken({routeDict, store, currentDate}, done) {  
  if ('code' in routeDict) {
    var reqOpts = {
      method: 'GET',
      url: 'http://162.243.21.88:5876/exchange?code=' + routeDict.code,
    };

    if (window.location.hostname === 'localhost') {
      reqOpts.url += '&test=true';
    }

    request(reqOpts, sb(extractToken, done));
  }  
  else if (store.tokenInfo) {
    var tokenInfo = JSON.parse(store.tokenInfo);
    if (tokenInfo.expires > currentDate.getTime()) {
      callNextTick(done, null, tokenInfo.token);
    }
    else {
      // Delete expired token.
      delete store.tokenInfo;
      callNextTick(done, new Error('No token or code found.'));
    }
  }
  else {
    callNextTick(done, new Error('No token or code found.'));
  }

  function extractToken(res, body) {
    if (res.statusCode === 200 && body) {
      store.tokenInfo = JSON.stringify({
        token: body,
        expires: currentDate.getTime() +
          estimatedExpirationLengthInDays * 24 * 60 * 60 * 1000
      });
    }

    if (store.tokenInfo) {
      done(null, JSON.parse(store.tokenInfo).token);
    }
    else {
      done(new Error('Could not get the token from token exchanger.'));
    }
  }
}

module.exports = findToken;
