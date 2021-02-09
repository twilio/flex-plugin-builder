#!/bin/bash

# Does a nightly build and publishes to npm

set -e

lerna="./node_modules/.bin/lerna"

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
id=`echo $(date '+%Y%m%d')`
nightlyVersion="${major}.${minor}.${patch}-nightly.${id}"

# Re-build package
npm run build

# Publish nightly build
${lerna} publish \
    --force-publish="*" \
    --skip-git \
    --no-git-tag-version \
    --no-push \
    --yes \
    --pre-dist-tag nightly \
    "${nightlyVersion}"


