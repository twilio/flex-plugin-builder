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

# Re-build package
npm run build

# Publish nightly build
node_modules/.bin/lerna publish \
    --force-publish="*" \
    --skip-git \
    --no-git-tag-version \
    --no-push \
    --pre-dist-tag dev \
    --preid dev \
    --yes \
    prerelease
