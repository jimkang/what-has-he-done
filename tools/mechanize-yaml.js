// Run this on a deeds.yaml file to ensure that it does not change after being parsed
// and restringified. If it does, then there are going to be problems with commits
// from the deed submitter.

var fs = require('fs');
var YAML = require('yamljs');
var yaml = require('js-yaml');

if (process.argv.length !== 3) {
  console.error('Usage: node tools/mechanize-yaml.js path-to-yaml-file > mechanized.yaml');
  process.exit();
}
var existingYAMLPath = process.argv[2];

var existingYAML = fs.readFileSync(existingYAMLPath, 'utf8');
// var parsed = YAML.parse(existingYAML);
var parsed = yaml.safeLoad(existingYAML);

// console.log(YAML.stringify(parsed, 2, 2));
console.log(yaml.safeDump(parsed));
