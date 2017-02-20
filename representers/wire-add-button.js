var d3 = require('d3-selection');
var compact = require('lodash.compact');

function wireAddButton({onClick}) {
  d3.select('#add-deed-button').on('click', sendFormValues);

  function sendFormValues() {
    d3.select('#success-message').classed('hidden', true);
    d3.select('#status-message').classed('hidden', true);

    var formRoot = d3.select('.deed-form');
    var urlItems = d3.select('.url-form-items').selectAll('li');

    var values = {
      name: getInputValue('#deed-name', formRoot),
      stamp: getInputValue('#deed-stamp', formRoot),
      description: getInputValue('#deed-description', formRoot),
      urls: compact(urlItems.nodes().map(getURLPair))
    };

    if (validate(values)) {
      onClick(values, updateStatus);
    }
  }
}

function getInputValue(fieldSelector, parent) {
  return parent.select(fieldSelector).node().value;
}

function getURLPair(element) {
  var urlItem = d3.select(element);
  var pair = {
    name: getInputValue('.deed-link-name', urlItem),
    url: getInputValue('.deed-link-url', urlItem)
  };
  if (pair.name && pair.url) {
    return pair;
  }
}

function validate(values) {
  if (!values.name) {
    updateMessage('Please enter a deed for the name.');
  }
  else if (!values.stamp) {
    updateMessage('Please set a date for this deed.');
  }
  else if (values.urls.length < 1) {
    updateMessage('Please provide at least one link for this deed.');
  }
  else {
    return true;
  }
}

function updateMessage(text) {
  d3.select('#status-message')
    .text(text)
    .classed('hidden', false);
}

function updateStatus(error, prURL) {
  if (error) {
    d3.select('#success-message').classed('hidden', true);
    updateMessage(
      'Had a problem submitting deed: ' + error.message + '\n' + error.stack
    );
  }
  else {
    d3.select('#success-message .pull-request-link').attr('href', prURL);
    d3.select('#success-message').classed('hidden', false);
    d3.select('#status-message').classed('hidden', true);
  }
}

module.exports = wireAddButton;
