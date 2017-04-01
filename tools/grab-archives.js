/* global process */

var request = require('request');
var config = require('../config');

const searchItemLimit = 100; // How can I get around this?

if (process.argv.length !== 2) {
  console.error('Usage: node tools/grab-archives.js > archives.json');
  process.exit();
}

var itemsWritten = 0;

getSearchResults(1, reportResult);

function getSearchResults(startIndex, done) {
  var reqOpts = {
    method: 'GET',
    url: 'https://www.googleapis.com/customsearch/v1?' +
      'key=' + config.google.apiKey + 
      '&cx=' + config.google.cx +  
      '&q=trump' +
      '&alt=json' + 
      '&start=' + startIndex,
    json: true
  };
  request(reqOpts, useResults);

  function useResults(error, res, body) {
    if (error) {
      done(error);
    }
    else {
      if (!body.items) {
        if (body.error) {
          done(new Error(body.error.message + ', url: ' + reqOpts.url));
        }
        else {
          done(new Error('No items in body for url: ' + reqOpts.url));
        }
      }
      else {
        body.items.forEach(writeOutSearchItem);
        itemsWritten += body.items.length;

        if (itemsWritten < searchItemLimit) {
          getSearchResults(itemsWritten + 1, done);
        }
      }
    }
  }
}

function writeOutSearchItem(item) {
  process.stdout.write(JSON.stringify(item) + '\n');
}

function reportResult(error) {
  if (error) {
    console.error(error);
  }
  else {
    console.error('Done!', itemsWritten, 'items written.');
  }
}
