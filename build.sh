#!/bin/bash

# Build script for Meeting Tab Closer extension
# Supports both Chrome and Firefox builds

set -e

VERSION=$(jq -r '.version' manifest.json)
NAME="meeting-tab-closer"

echo "Building Meeting Tab Closer v$VERSION"

# Create build directory
mkdir -p build
rm -rf build/*

# Build Chrome version
echo "Building Chrome version..."
mkdir -p "build/chrome-$VERSION"
cp manifest.json "build/chrome-$VERSION/"
cp background.js "build/chrome-$VERSION/"
cp content.js "build/chrome-$VERSION/"
cp popup.html "build/chrome-$VERSION/"
cp popup.js "build/chrome-$VERSION/"
cp styles.css "build/chrome-$VERSION/"
cp README.md "build/chrome-$VERSION/"
cp -r icons "build/chrome-$VERSION/"

# Create Chrome zip
cd build
zip -r "$NAME-chrome-$VERSION.zip" "chrome-$VERSION"
cd ..

# Build Firefox version
echo "Building Firefox version..."
mkdir -p "build/firefox-$VERSION"
cp manifest-firefox.json "build/firefox-$VERSION/manifest.json"
cp background-firefox.js "build/firefox-$VERSION/background.js"
cp content-firefox.js "build/firefox-$VERSION/content.js"
cp popup-firefox.html "build/firefox-$VERSION/popup.html"
cp popup-firefox.js "build/firefox-$VERSION/popup.js"
cp styles.css "build/firefox-$VERSION/"
cp README.md "build/firefox-$VERSION/"
cp -r icons "build/firefox-$VERSION/"

# Create Firefox zip
cd build
zip -r "$NAME-firefox-$VERSION.zip" "firefox-$VERSION"
cd ..

echo "Build complete!"
echo "Chrome build: build/$NAME-chrome-$VERSION.zip"
echo "Firefox build: build/$NAME-firefox-$VERSION.zip"

# Optional: Create web-ext build for Firefox (if web-ext is installed)
if command -v web-ext &> /dev/null; then
    echo "Creating Firefox web-ext build..."
    cd "build/firefox-$VERSION"
    web-ext build --overwrite-dest
    mv web-ext-artifacts/*.zip "../$NAME-firefox-$VERSION-signed.zip" 2>/dev/null || true
    cd ../..
fi
