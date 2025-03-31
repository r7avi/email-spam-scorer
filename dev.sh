#!/bin/bash

# Install dependencies if needed
npm install

# Start PM2 with the ecosystem config
pm2 start ecosystem.config.js

# Watch for file changes and sync to server
while true; do
    # Sync files to server (replace with your server details)
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' --include '.env.local' ./ root@172.235.5.162:/var/www/email-spam-scorer/
    
    # Wait for 10 seconds before next sync (increased from 5 to reduce load)
    sleep 10
done 