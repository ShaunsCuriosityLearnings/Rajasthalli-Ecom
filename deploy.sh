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

# 2.5 Update database schema
echo "🗄️ Syncing database schema with Prisma..."
npx prisma db push --schema=packages/productdb/prisma/schema.prisma --skip-generate

# 3. Build all applications (both microservices & Next.js frontends)
echo "🏗️ Building all applications..."
npm run build

# 4. Restart services in PM2
echo "🔄 Restarting PM2 processes..."

# Check if any PM2 process is running, restart if yes, otherwise start them
if pm2 list | grep -q "product-service"; then
    echo "PM2 processes found. Restarting..."
    pm2 restart all
else
    echo "PM2 processes not found. Launching services..."
    
    # Start all 5 backend APIs
    pm2 start npm --name "product-service" --cwd "apps/product-service" -- run start
    pm2 start npm --name "order-service" --cwd "apps/order-service" -- run start
    pm2 start npm --name "payment-service" --cwd "apps/payment-service" -- run start
    pm2 start npm --name "auth-service" --cwd "apps/auth-service" -- run start
    pm2 start npm --name "email-service" --cwd "apps/email-service" -- run start
    
    # Start the 2 Next.js frontend applications
    pm2 start npm --name "client-front" --cwd "apps/client" -- run start
    pm2 start npm --name "admin-front" --cwd "apps/admin" -- run start
    
    pm2 startup
    pm2 save
fi

echo "============================================="
echo "🎉 Deployment completed successfully!"
echo "============================================="
