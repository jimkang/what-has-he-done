var qs = require('qs');
var handleError = require('handle-error-web');
var sb = require('standard-bail')();
var intersection = require('lodash.intersection');
var listEmAll = require('list-em-all');
var curry = require('lodash.curry');

var allThings;

((function go() {
  route();
})());

function parseRoute() {
  // Skip the # part of the hash.
  return qs.parse(window.location.hash.slice(1));
}

function route() {
  var routeDict = parseRoute();
  if ('dataURL' in routeDict) {
    listEmAll.loadList({url: routeDict.dataURL}, sb(updateAllThings, handleError));
  }
}

function updateAllThings(thingsLoaded) {
  allThings = thingsLoaded;
  renderCurrentRoute();
}

function updateTags(tag) {
  var routeDict = parseRoute();
  routeDict.tags = tag;
  window.location.hash = qs.stringify(routeDict);

  listEmAll.render({
    thingList: allThings.filter(curry(hasTags)([tag])),
    thingClass: 'thing',
    rootId: 'things-root',
    onTagClick: updateTags
  });
}

function renderCurrentRoute() {
  var routeDict = parseRoute();
  var tags = routeDict.tags;
  var thingsToRender = allThings;

  if (tags) {
    tags = tags.split(',');
    thingsToRender = allThings.filter(curry(hasTags)(tags));
  }

  listEmAll.render({
    thingList: thingsToRender,
    thingClass: 'thing',
    rootId: 'things-root',
    onTagClick: updateTags
  });  
}

function hasTags(tags, thing) {
  var commonTags = intersection(thing.tags, tags);
  return commonTags.length > 0;
}  
