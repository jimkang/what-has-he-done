BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/.bin/uglifyjs
TRANSFORM_SWITCH = -t [ babelify --presets [ es2015 ] ]

run-add-deed:
	wzrd add-deed-app.js:add-deed/add-deed-index.js \
		 # --https \
		 -- \
			-d \
			$(TRANSFORM_SWITCH)

run:
	wzrd app.js:index.js -- \
		-d \
		$(TRANSFORM_SWITCH)

build:
	$(BROWSERIFY) $(TRANSFORM_SWITCH) app.js | $(UGLIFY) -c -m -o index.js
	$(BROWSERIFY) $(TRANSFORM_SWITCH) add-deed-app.js | $(UGLIFY) -c -m -o add-deed/add-deed-index.js

test:
	node tests/deed-submitter-tests.js

pushall:
	git push origin gh-pages

lint:
	eslint .

try-creating-branch:
	curl 'https://api.github.com/repos/jimkang/what-has-he-done-data/git/refs' \
		-X POST \
		-H 'Authorization: token <your-token-goes-here>' \
		-H 'User-Agent: add-deed' \
		-H 'Content-Type: application/json' \
		-H 'accept: application/json' \
		-d '{"ref":"refs/heads/from-curl","sha":"0946f6c2e8922dded900de246ce446a5a86ad0c7"}'

try-custom-search:
	curl "https://www.googleapis.com/customsearch/v1?key=<api-key>&cx=<custom-search-id>&q=trump&alt=json&start=90"
