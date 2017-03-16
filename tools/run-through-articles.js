/* global process, __dirname */

var FeedParser = require('feedparser');
var fs = require('fs');
// var sb = require('standard-bail')();
var pick = require('lodash.pick');
var through2 = require('through2');
var TfIdf = require('natural').TfIdf;
var ldj = require('ldjson-stream');
var pluck = require('lodash.pluck');
// var WordTokenizer = require('natural').WordTokenizer;

// var tokenizer = new natural.WordTokenizer();

var crossDocTfidf = new TfIdf();
var crossDocIndex = 0;

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
  var addInferencesStream = through2({objectMode: true}, addInferences);
  var debugSummaryStream = through2({objectMode: true}, getDebugSummary);
  var ppJSONStream = through2({objectMode: true}, stringifyNice);

  addDocToCrossDocTfidfStream
    .on('data', saveItem)
    .on('end', startTfidf);

  fs.createReadStream(__dirname + '/../data/pro-publica-rss.xml')
    .pipe(feedparser)
    .pipe(tfStream)
    .pipe(addDocToCrossDocTfidfStream);

  function startTfidf() {
    // console.log('items', JSON.stringify(items, null, '  '));
    // console.log('Would start tf-idf here!');
    var tfidfStream = through2({objectMode: true}, addTFIDF);
    tfidfStream
      .pipe(addInferencesStream)
      .pipe(debugSummaryStream)
      // .pipe(ldj.serialize())
      .pipe(ppJSONStream)
      .pipe(process.stdout);

    items.forEach(writeItemToStream);
    tfidfStream.end();

    function writeItemToStream(item) {
      tfidfStream.write(item);
    }
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

  item.descriptionTf = tfidf.listTerms(0).slice(0, 20);

  this.push(item);
  done();
}

function addDocToCrossDocTfidf(item, enc, done) {
  // console.log('adding', item)
  crossDocTfidf.addDocument(item.description);
  item.docIndex = crossDocIndex;
  crossDocIndex += 1;
  this.push(item);
  done();
}

function addTFIDF(item, enc, done) {
  item.descriptionTfidf = crossDocTfidf.listTerms(item.docIndex).slice(0, 20);

  // Temporary for easy reading during debugging:
  // delete item.description;
  // delete item.summary;

  this.push(item);
  done();
}

function addInferences(item, enc, done) {
  item.topics = pluck(item.descriptionTf, 'term');
  item.notableTerms = pluck(item.descriptionTfidf, 'term');
  this.push(item);
  done();
}

function getDebugSummary(item, enc, done) {
  this.push({
    topics: item.topics,
    notableTerms: item.notableTerms,
    title: item.title,
    guid: item.guid
  });
  done();
}

function stringifyNice(item, enc, done) {
  this.push(JSON.stringify(item, null, '  '));
  done();
}

function reportError(error) {
  console.log(error);
}

parseRSS();
