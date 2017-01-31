var qs = require('qs');
var findToken = require('./find-token');
var config = require('./config');
var handleError = require('handle-error-web');
var wireAddButton = require('./representers/wire-add-button');
var SubmitDeed = require('./submit-deed');
var sb = require('standard-bail')();

var token;
var submitDeed;

((function go() {
  route();
  wireAddButton({onClick: submitDeed});
})());

function route() {
  // Skip the # part of the query.
  var routeDict = qs.parse(window.location.search.slice(1));

  findToken(
    {
      routeDict: routeDict,
      store: window.localStorage,
      currentDate: new Date()
    },
    decideOnToken
  );
}

function decideOnToken(error, retrievedToken, done) {
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
    submitDeed = SubmitDeed({
      gitRepoOwner
    });
  }
}

function redirectToAuth() {
  var authURI = 'https://github.com/login/oauth/authorize?' + 
    'client_id=' + config.github.clientId +
    '&scope=public_repo';

  window.location.href = authURI;
}
