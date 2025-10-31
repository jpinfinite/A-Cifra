#!/bin/bash

# Build script for Cloudflare Pages
echo "🚀 Starting Cloudflare Pages build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build the project
echo "🏗️ Building Next.js project..."
npm run build

# Verify output directory exists
if [ -d "out" ]; then
    echo "✅ Build successful! Output directory 'out' created."
    ls -la out/
else
    echo "❌ Build failed! Output directory 'out' not found."
    exit 1
fi

echo "🎉 Cloudflare Pages build completed successfully!"