#!/usr/bin/env bash
# Install Maven dependencies.
echo "Resolving Maven plugins..."
mvn dependency:resolve-plugins -T1C > /dev/null
