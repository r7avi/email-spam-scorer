module.exports = {
  apps: [
    {
      name: 'email-spam-scorer',
      script: 'npm',
      args: 'run dev',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        MONGODB_URI: 'mongodb+srv://ir7avi:QrDNheBivvUmZNBp@cluster0.cfyi8.mongodb.net/email-spam-scorer'
      }
    },
    {
      name: 'email-receiver',
      script: 'src/scripts/email-receiver.js',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        MONGODB_URI: 'mongodb+srv://ir7avi:QrDNheBivvUmZNBp@cluster0.cfyi8.mongodb.net/email-spam-scorer'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        MONGODB_URI: 'mongodb+srv://ir7avi:QrDNheBivvUmZNBp@cluster0.cfyi8.mongodb.net/email-spam-scorer'
      }
    }
  ]
}; 