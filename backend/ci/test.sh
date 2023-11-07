#!/usr/bin/env bash
sh ci/private/include.sh

echo "Testing backend..."
mvn "-Dtest=**.*Test" "-DfailIfNoTests=false" test --no-transfer-progress
