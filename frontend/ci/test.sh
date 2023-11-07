#!/usr/bin/env bash
sh ci/private/include.sh

echo "Testing frontend..."
npm run test
