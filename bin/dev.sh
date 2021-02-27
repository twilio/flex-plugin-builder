#!/bin/bash

# Publishes a dev build of plugin-builder

set -e

if [ "$TRAVIS_EVENT_TYPE" != "push" ] ; then
  echo "Dev builds can only be invoked via Travis push jobs events"
  exit 1
fi

if [ -v "$TRAVIS_TAG" ] ; then
  echo "Skipping dev build on a tagged push"
  exit 0
fi

function getJsonValue() {
  KEY=$1
  num=$2
  awk -F"[,:}]" '{for(i=1;i<=NF;i++){if($i~/'$KEY'\042/){print $(i+1)}}}' | tr -d '"' | sed -n ${num}p
}

currentVersion=$(cat ./lerna.json | getJsonValue 'version' |  cut -f1 -d"-")
semver=( ${currentVersion//./ } )
major="${semver[0]}"
minor="${semver[1]}"
patch="${semver[2]}"
id=`echo $(date '+%Y%m%d%H%M')`
devVersion="${major}.${minor}.${patch}-dev.${id}"

# Re-build package
npm run build

# Publish nightly build
node_modules/.bin/lerna publish \
    --force-publish="*" \
    --skip-git \
    --no-git-tag-version \
    --no-push \
    --pre-dist-tag dev \
    --yes \
    "${devVersion}"
