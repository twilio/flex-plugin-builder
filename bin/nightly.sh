#!/bin/bash

# Publishes a nightly build of plugin-builder

set -e

if [ "$TRAVIS_EVENT_TYPE" != "cron" ] ; then
  echo "Nightly builds can only be invoked via Travis CRON jobs"
  exit 1
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
id=`echo $(date '+%Y%m%d')`
nightlyVersion="${major}.${minor}.${patch}-nightly.${id}"

# Re-build package
npm run build

# Publish nightly build
./node_modules/.bin/lerna publish \
    --force-publish="*" \
    --skip-git \
    --no-git-tag-version \
    --no-push \
    --pre-dist-tag nightly \
    --yes \
    "${nightlyVersion}"
