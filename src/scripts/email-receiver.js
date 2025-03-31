require('dotenv').config();
const net = require('net');
const { Email } = require('../models/Email');
const { EmailAnalyzer } = require('../services/emailAnalyzer');

const SMTP_PORT = 3001;

const server = net.createServer((socket) => {
  let emailData = {
    from: '',
    to: '',
    subject: '',
    headers: {},
    content: ''
  };

  let currentLine = '';
  let isInHeaders = true;
  let isInData = false;

  socket.on('data', (data) => {
    const lines = data.toString().split('\r\n');
    
    for (const line of lines) {
      if (line === '') {
        if (isInHeaders) {
          isInHeaders = false;
          isInData = true;
        }
        continue;
      }

      if (isInHeaders) {
        const [key, value] = line.split(': ');
        if (key && value) {
          emailData.headers[key.toLowerCase()] = value;
          
          if (key.toLowerCase() === 'from') {
            emailData.from = value;
          } else if (key.toLowerCase() === 'to') {
            emailData.to = value;
          } else if (key.toLowerCase() === 'subject') {
            emailData.subject = value;
          }
        }
      } else if (isInData) {
        emailData.content += line + '\n';
      }
    }
  });

  socket.on('end', async () => {
    try {
      // Analyze the email
      const analysis = EmailAnalyzer.analyzeEmail(emailData);
      emailData.score = analysis.score;
      emailData.analysis = analysis;

      // Store in database
      await Email.create(emailData);

      // Send success response
      socket.write('250 OK\r\n');
      socket.end();
    } catch (error) {
      console.error('Error processing email:', error);
      socket.write('500 Error processing email\r\n');
      socket.end();
    }
  });
});

// Listen on all network interfaces
server.listen(SMTP_PORT, '0.0.0.0', () => {
  console.log(`SMTP server listening on all interfaces on port ${SMTP_PORT}`);
}); 