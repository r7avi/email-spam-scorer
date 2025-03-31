// This file serves as an adapter between ESM (Next.js) and CommonJS (Node.js) modules
// It re-exports the EmailAnalyzer service in a way that Next.js can import

// Import the EmailAnalyzer service from the CommonJS module
const { EmailAnalyzer } = require('../services/emailAnalyzer');

// Export the EmailAnalyzer service for ESM use
export { EmailAnalyzer }; 