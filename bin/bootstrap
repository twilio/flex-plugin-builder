#!/bin/bash

nodeVersion=$(node -v)

if [[ "$nodeVersion" == "v14"* ]]; then
    echo "Running Lerna Bootstrap"
    lerna bootstrap --no-ci
fi

if [[ "$nodeVersion" == "v16"* ]] || [[ "$nodeVersion" == "v18"* ]]; then
    echo "Running Lerna Bootstrap with --use-workspaces"
    lerna bootstrap --no-ci --use-workspaces
fi
