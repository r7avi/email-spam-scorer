#!/bin/bash

# Stop all running PM2 processes
echo "Stopping all PM2 processes..."
pm2 stop all
pm2 delete all

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the email receiver
echo "Starting email receiver..."
pm2 start src/scripts/email-receiver.js --name email-receiver

# Start the Next.js application
echo "Starting Next.js application..."
pm2 start npm --name email-spam-scorer -- run dev

# Save the PM2 process list
echo "Saving PM2 process list..."
pm2 save

echo "All services started. You can access the application at:"
echo "http://localhost:3000"
echo "or using your server's public IP:"
echo "http://YOUR_SERVER_IP:3000"

# Display the status of the running processes
echo "Current PM2 processes:"
pm2 status 