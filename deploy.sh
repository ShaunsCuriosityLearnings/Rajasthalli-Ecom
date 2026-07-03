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

# 3. Restart services in PM2 using tsx directly
echo "🔄 Restarting PM2 processes..."

# Check if any PM2 process is running, restart if yes, otherwise start them
if pm2 list | grep -q "product-service"; then
    echo "PM2 processes found. Restarting..."
    pm2 restart all
else
    echo "PM2 processes not found. Launching services..."
    
    # Start all 5 backend APIs using npx tsx directly from the root
    pm2 start npx --name "product-service" --cwd "apps/product-service" -- tsx --env-file=.env src/index.ts
    pm2 start npx --name "order-service" --cwd "apps/order-service" -- tsx --env-file=.env src/index.ts
    pm2 start npx --name "payment-service" --cwd "apps/payment-service" -- tsx --env-file=.env src/index.ts
    pm2 start npx --name "auth-service" --cwd "apps/auth-service" -- tsx --env-file=.env src/index.ts
    pm2 start npx --name "email-service" --cwd "apps/email-service" -- tsx --env-file=.env src/index.ts
    
    pm2 startup
    pm2 save
fi

echo "============================================="
echo "🎉 Deployment completed successfully!"
echo "============================================="
