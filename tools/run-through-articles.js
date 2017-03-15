/* global process, __dirname */

var FeedParser = require('feedparser');
var fs = require('fs');
// var sb = require('standard-bail')();
var pick = require('lodash.pick');
var through2 = require('through2');
var TfIdf = require('natural').TfIdf;
// var WordTokenizer = require('natural').WordTokenizer;

// var tokenizer = new natural.WordTokenizer();

var crossDocTfidf = new TfIdf();

function parseRSS() {
  var items = [];
  var feedparser = new FeedParser();

  feedparser.on('error', reportError);
  // feedparser.on('readable', collectItems);
  // feedparser.on('end', logItems);

  var tfStream = through2({objectMode: true}, addTermFrequencyToNewsItem);
  var addDocToCrossDocTfidfStream = through2(
    {objectMode: true}, addDocToCrossDocTfidf
  );

  addDocToCrossDocTfidfStream
    .on('data', saveItem)
    .on('end', startTfidf);


  fs.createReadStream(__dirname + '/../data/pro-publica-rss.xml')
    .pipe(feedparser)
    .pipe(tfStream)
    .pipe(addDocToCrossDocTfidfStream);

  function startTfidf() {
    console.log('items', JSON.stringify(items, null, '  '));
    console.log('Would start tf-idf here!');
  }

    // .pipe(process.stdout);

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
  function saveItem(item) {
    // console.log('pushing', item)
    items.push(item);
  }
}

function addTermFrequencyToNewsItem(rssEntry, enc, done) {
  debugger;
  var item = pick(rssEntry, 'title', 'description', 'summary', 'pubdate', 'guid');

  var tfidf = new TfIdf();
  tfidf.addDocument(item.description);
  // Temporarily for debugging:
  // delete item.description;
  delete item.summary;

  item.descriptionTf = tfidf.listTerms(0).slice(0, 20);

  this.push(item);
  done();
}

function addDocToCrossDocTfidf(item, enc, done) {
  // console.log('adding', item)
  crossDocTfidf.addDocument(item.description);
  this.push(item);
  done();
}

function reportError(error) {
  console.log(error);
}

parseRSS();
