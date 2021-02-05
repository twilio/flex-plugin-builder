#!/bin/bash

jest=./node_modules/.bin/jest
nyc=./node_modules/.bin/nyc

rm -rf ./coverage
mkdir -p ./coverage/partial

${jest} ./packages/flex-plugin-scripts --config ./packages/flex-plugin-scripts/jest.config.js --coverage --color
mv ./coverage/coverage-final.json "./coverage/partial/flex-plugin-scripts.json"


${jest} ./packages/flex-dev-utils --config ./packages/flex-dev-utils/jest.config.js --coverage --color
mv ./coverage/coverage-final.json "./coverage/partial/flex-dev-utils.json"


${nyc} report -t ./coverage/partial --report-dir ./coverage --reporter=html --reporter=lcov

exit 0

for dir in ./packages/* ; do
  pkg=$(basename "${dir}")

  ${jest} ./packages/"${pkg}" --config "./packages/${pkg}/jest.config.js" --coverage --color
  mv ./coverage/coverage-final.json "./coverage/${pkg}.json"
done

