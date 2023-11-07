#!/usr/bin/env bash
export CI=true

# Install NPM dependencies.
echo "Resolving NPM dependencies..."
npm ci
