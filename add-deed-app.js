var qs = require('qs');
var findToken = require('./find-token');
var config = require('./config');
var handleError = require('handle-error-web');

var token;

route();

function route() {
  // Skip the # part of the query.
  var routeDict = qs.parse(window.location.search.slice(1));

  findToken(
    {
      routeDict: routeDict,
      store: window.localStorage,
      currentDate: new Date()
    },
    saveToken
  );
}

function saveToken(error, retrievedToken) {
  if (error) {
    if (error.message === 'No token or code found.') {
      redirectToAuth();
    }
    else {
      handleError(error);
    }
  }
  else {
    token = retrievedToken;
    // TODO.
  }
}

function redirectToAuth() {
  var authURI = 'https://github.com/login/oauth/authorize?' + 
    'client_id=' + config.github.clientId +
    '&scope=public_repo';

  window.location.href = authURI;
}
