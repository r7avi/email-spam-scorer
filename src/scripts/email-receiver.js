const path = require('path');

// Load environment variables first from the correct path
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import proper SMTP server library
const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const { Email } = require('../models/Email');
const { EmailAnalyzer } = require('../services/emailAnalyzer');
const { initConnection } = require('../lib/mongodb');

const SMTP_PORT = process.env.EMAIL_RECEIVER_PORT || 3001;

async function startServer() {
  try {
    // Test MongoDB connection before starting server
    await initConnection();
    console.log('MongoDB connection successful');

    // Create SMTP server
    const server = new SMTPServer({
      // Allow insecure auth
      authOptional: true,
      
      // Don't require STARTTLS
      disabledCommands: ['STARTTLS'],
      
      // Don't validate MAIL FROM and RCPT TO commands
      disableReverseLookup: true,
      
      // Maximum allowed message size in bytes
      size: 10 * 1024 * 1024, // 10 MB
      
      // Handler for SMTP envelope
      onMailFrom(address, session, callback) {
        console.log('Mail from:', address.address);
        return callback();
      },
      
      // Handler for recipients
      onRcptTo(address, session, callback) {
        console.log('Recipient:', address.address);
        return callback();
      },
      
      // Handler for message data
      async onData(stream, session, callback) {
        try {
          console.log('Receiving email...');
          
          // Parse email data
          const parsed = await simpleParser(stream);
          
          // Create email data object
          const emailData = {
            from: parsed.from?.text || '',
            to: parsed.to?.text || '',
            subject: parsed.subject || '',
            content: parsed.text || parsed.html || '',
            headers: parsed.headers || {},
            createdAt: new Date()
          };
          
          console.log('Processing email from:', emailData.from);
          console.log('Subject:', emailData.subject);
          
          // Analyze the email
          const analysis = EmailAnalyzer.analyzeEmail(emailData);
          emailData.score = analysis.score;
          emailData.analysis = analysis;
          
          console.log('Analysis score:', analysis.score);
          
          // Store in database
          const result = await Email.create(emailData);
          console.log('Email stored in database with ID:', result.insertedId);
          
          callback();
        } catch (error) {
          console.error('Error processing email:', error);
          callback(new Error('Error processing email'));
        }
      },
      
      // Error handler
      onError(err) {
        console.error('SMTP Server Error:', err);
      }
    });

    // Start server
    server.listen(SMTP_PORT, '0.0.0.0', () => {
      console.log(`SMTP server listening on all interfaces on port ${SMTP_PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 