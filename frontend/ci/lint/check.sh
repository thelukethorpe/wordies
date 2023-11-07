#!/usr/bin/env bash
sh ci/private/include.sh

echo "Checking frontend style..."
npm run lint:check
