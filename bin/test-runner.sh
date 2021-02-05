#!/bin/bash

# Test runner for running jest one by one and collect the overall coverage at the end

jest=./node_modules/.bin/jest
nyc=./node_modules/.bin/nyc

# Run on the given path
if [ -f "$1" ] || [ -d "$1" ] ; then
  path=${1}
  pkg=$(echo "${path}" | sed -n -e 's/^.*packages//p' | awk -F "/" '{print $2}')
  shift

  ${jest} "${path}" --config "./packages/${pkg}/jest.config.js" --color "$@"
  exit $?
fi

# Run on all
rm -rf ./coverage
for dir in ./packages/* ; do
  pkg=$(basename "${dir}")

  if [ -z "$EXPOSE_GC" ] ; then
    ${jest} ./packages/"${pkg}" --config "./packages/${pkg}/jest.config.js" --color --coverage "$@"
    mv ./coverage/coverage-final.json "./coverage/${pkg}.json"
  else
    node --expose-gc --trace-warnings ${jest} ./packages/"${pkg}" --config "./packages/${pkg}/jest.config.js" -i --runInBand --logHeapUsage
  fi
done

# Combine reports
if [ "$(ls -A ./coverage)" ] ; then
  ${nyc} report -t ./coverage --report-dir ./coverage --reporter=html --reporter=lcov
fi
