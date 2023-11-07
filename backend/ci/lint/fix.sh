#!/usr/bin/env bash
sh ci/private/include.sh

echo "Fixing backend style..."
mvn com.spotify.fmt:fmt-maven-plugin:format -q
