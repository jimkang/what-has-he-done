BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/.bin/uglifyjs
TRANSFORM_SWITCH = -t [ babelify --presets [ es2015 ] ]

run-add-deed:
	wzrd add-deed-app.js:add-deed/index.js \
		 --https \
		 -- \
			-d \
			$(TRANSFORM_SWITCH)

run:
	wzrd app.js:index.js -- \
		-d \
		$(TRANSFORM_SWITCH)

build:
	$(BROWSERIFY) $(TRANSFORM_SWITCH) app.js | $(UGLIFY) -c -m -o index.js
	$(BROWSERIFY) $(TRANSFORM_SWITCH) add-deed-app.js | $(UGLIFY) -c -m -o add-deed-index.js

test:
	node tests/basictests.js

pushall:
	git push origin gh-pages

lint:
	eslint .
