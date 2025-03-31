# Email Spam Scorer

A system to receive, analyze, and score emails for spam indicators.

## Features

- Generate random email addresses for testing
- Receive and analyze emails for spam indicators
- View emails with spam scores and analysis
- SMTP server integration with Postfix

## Setup

### Prerequisites

- Node.js 18+ and npm
- MongoDB
- PM2 (for process management)

### Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email-spam-scorer
```

4. Start the development server:
```bash
npm run dev
```

5. In a separate terminal, start the email receiver:
```bash
npm run email-receiver
```

6. Access the application at http://localhost:3000

### Linux Server Deployment

1. Clone the repository on your server
2. Set up your `.env.local` file
3. Make the restart script executable:
```bash
chmod +x restart.sh
```

4. Run the restart script:
```bash
./restart.sh
```

This will:
- Stop any running PM2 processes
- Clean any previous builds
- Install dependencies
- Start the email receiver
- Start the Next.js application
- Save the PM2 process list

5. Access the application at http://YOUR_SERVER_IP:3000

## Troubleshooting

### Common Issues

- **Next.js build errors**: Try running the clean build script:
```bash
chmod +x clean-build.sh
./clean-build.sh
```

- **Email receiver not starting**: Check the PM2 logs:
```bash
pm2 logs email-receiver
```

- **Postfix connection errors**: Make sure port 3001 is open and the email receiver is running

## Architecture

- Next.js frontend for the web interface
- Node.js SMTP server for receiving emails
- MongoDB for storing emails and analysis
- Postfix integration for email forwarding
