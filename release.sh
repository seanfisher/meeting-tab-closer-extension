#!/bin/bash

# Release script for Meeting Tab Closer
# Usage: ./release.sh [version]
# Example: ./release.sh 1.2.0

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.2.0"
    exit 1
fi

VERSION=$1
TAG="v$VERSION"

echo "Creating release for version $VERSION..."

# Update version in manifest.json
sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" manifest.json
rm manifest.json.bak

# Update version in README.md
sed -i.bak "s/— v[0-9]\+\.[0-9]\+\.[0-9]\+/— v$VERSION/" README.md
rm README.md.bak

echo "Updated version to $VERSION in manifest.json and README.md"

# Commit changes
git add manifest.json README.md
git commit -m "Bump version to $VERSION"

# Create and push tag
git tag $TAG
git push origin main
git push origin $TAG

echo "Released version $TAG!"
echo "GitHub Action will automatically create the release with downloadable zip."
echo "Check: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^.]*\).*/\1/')/actions"
