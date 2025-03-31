#!/bin/bash

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next
rm -rf node_modules

# Install dependencies
echo "Installing dependencies..."
npm install

# Create production build
echo "Building application..."
npm run build

echo "Build complete. You can now start the application with:"
echo "npm start"
echo "Or run in development mode with:"
echo "npm run dev" 