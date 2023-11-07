#!/usr/bin/env bash
sh ci/private/include.sh

echo "Checking backend style..."
mvn com.spotify.fmt:fmt-maven-plugin:check -q
