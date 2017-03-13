/* global process, __dirname */

var FeedParser = require('feedparser');
var fs = require('fs');
// var sb = require('standard-bail')();
var pick = require('lodash.pick');
var through2 = require('through2');
var TfIdf = require('natural').TfIdf;
// var WordTokenizer = require('natural').WordTokenizer;

// var tokenizer = new natural.WordTokenizer();

function parseRSS() {
  // var items = [];
  var feedparser = new FeedParser();

  feedparser.on('error', reportError);
  // feedparser.on('readable', collectItems);
  // feedparser.on('end', logItems);

  var tfIdfStream = through2({objectMode: true}, addTfIdfToNewsItem);

  fs.createReadStream(__dirname + '/../data/pro-publica-rss.xml')
    .pipe(feedparser)
    .pipe(tfIdfStream)
    .pipe(process.stdout);

  // function collectItems() {
  //   var stream = this;
  //   var rssEntry;

  //   while ((rssEntry = stream.read())) {
  //     if (rssEntry) {
  //       items.push(pick(rssEntry, 'title', 'description', 'summary', 'pubdate', 'guid'));
  //     }
  //   }
  // }

  // function logItems() {
  //   console.log(JSON.stringify(items, null, '  '));
  // }
}

function addTfIdfToNewsItem(rssEntry, enc, done) {
  debugger;
  var item = pick(rssEntry, 'title', 'description', 'summary', 'pubdate', 'guid');

  var tfidf = new TfIdf();
  tfidf.addDocument(item.description);
  // Temporarily for debugging:
  delete item.description;
  delete item.summary;

  item.descriptionTfIdf = tfidf.listTerms(0).slice(0, 10);
  // TODO: Just push an object and have another stream parse it.
  this.push(JSON.stringify(item, null, '  '));;
  done();
}

function reportError(error) {
  console.log(error);
}

parseRSS();
