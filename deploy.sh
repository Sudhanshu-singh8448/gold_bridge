#!/bin/bash
set -e

APP_DIR="$HOME/gold_bridge"
cd "$APP_DIR"

echo "=========================================="
echo "🚀 GoldBridge Deployment Starting..."
echo "=========================================="

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install frontend dependencies & build
echo "📦 Installing frontend dependencies..."
npm install --production=false

echo "🔨 Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install --production
cd ..

# Restart backend with PM2
echo "🔄 Restarting backend..."
pm2 startOrReload ecosystem.config.cjs --update-env

echo "=========================================="
echo "✅ Deployment complete!"
echo "=========================================="
pm2 status
