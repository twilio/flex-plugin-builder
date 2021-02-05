#!/bin/bash

# Test runner for running jest one by one and collect the overall coverage at the end
#
# To run a single test (or a pattern) you can use:
# $ ./node_modules/.bin/jest --config ./packages/THE_PACKAGE/jest.config.js ./packages/THE_PACKAGE/path/tp/file/or/dir

jest=./node_modules/.bin/jest
nyc=./node_modules/.bin/nyc

rm -rf ./coverage

for dir in ./packages/* ; do
  pkg=$(basename "${dir}")

  if [ ]
  #${jest} ./packages/"${pkg}" --config "./packages/${pkg}/jest.config.js" --color "$@"
  # Comment the previous line and uncomment this line to check for memory leak
   node --expose-gc --trace-warnings ${jest} ./packages/"${pkg}" --config "./packages/${pkg}/jest.config.js" -i --runInBand --logHeapUsage

  #mv ./coverage/coverage-final.json "./coverage/${pkg}.json"
done

#${nyc} report -t ./coverage --report-dir ./coverage --reporter=html --reporter=lcov
