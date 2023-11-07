#!/usr/bin/env bash
sh ci/private/include.sh

echo "Building backend..."
mvn compile
