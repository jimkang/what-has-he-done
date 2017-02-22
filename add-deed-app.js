/* global jsyaml */

var qs = require('qs');
var findToken = require('./find-token');
var config = require('./config');
var handleError = require('handle-error-web');
var wireDeedForm = require('./representers/wire-deed-form');
var DeedSubmitter = require('./deed-submitter');
var request = require('basic-browser-request');
var safeEncoders = require('./safe-encoders');

var token;
var submitDeed;

((function go() {
  route();
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

function decideOnToken(error, retrievedToken) {
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

    submitDeed = DeedSubmitter({
      gitRepoOwner: 'jimkang',
      gitToken: token,
      request: request,
      encodeInBase64: safeEncoders.encodeInBase64,
      decodeFromBase64: safeEncoders.decodeFromBase64,
      jsyaml: jsyaml
    })
    .submitDeed;

    wireDeedForm({onAddDeedClick: submitDeed});
  }
}

function redirectToAuth() {
  var clientId = config.github.clientId;
  if (window.location.hostname === 'localhost') {
    clientId = config.githubTest.clientId;
  }
  var authURI = 'https://github.com/login/oauth/authorize?' + 
    'client_id=' + clientId +
    '&scope=public_repo';

  window.location.href = authURI;
}
