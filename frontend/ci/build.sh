#!/usr/bin/env bash
sh ci/private/include.sh

echo "Building frontend..."
npm run build
