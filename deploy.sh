#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "============================================="
echo "🚀 Starting Deployment on VPS..."
echo "============================================="

# 1. Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# 3. Build all TS packages & microservices
echo "🏗️ Building applications..."
npm run build

# 4. Restart services in PM2
echo "🔄 Restarting PM2 processes..."
# Check if any PM2 process is running, restart if yes, otherwise start them
if pm2 list | grep -q "product-service"; then
    echo "PM2 processes found. Restarting..."
    pm2 restart all
else
    echo "PM2 processes not found. Launching services..."
    pm2 start dist/apps/product-service/src/index.js --name "product-service"
    pm2 start dist/apps/order-service/src/index.js --name "order-service"
    pm2 start dist/apps/payment-service/src/index.js --name "payment-service"
    pm2 start dist/apps/auth-service/src/index.js --name "auth-service"
    pm2 start dist/apps/email-service/src/index.js --name "email-service"
    pm2 startup
    pm2 save
fi

echo "============================================="
echo "🎉 Deployment completed successfully!"
echo "============================================="
