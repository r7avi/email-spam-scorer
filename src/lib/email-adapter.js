// This file serves as an adapter between ESM (Next.js) and CommonJS (Node.js) modules
// It re-exports the Email model in a way that Next.js can import

// Import the Email model from the CommonJS module
const { Email } = require('../models/Email');

// Export the Email model for ESM use
export { Email }; 