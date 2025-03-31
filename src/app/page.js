'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateEmail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'generate' })
      });
      const data = await response.json();
      setEmailAddress(data.address);
      startPolling(data.address);
    } catch (err) {
      setError('Failed to generate email address');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (address) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/email?address=${address}`);
        const data = await response.json();
        setEmails(data.emails);
      } catch (err) {
        console.error('Error polling emails:', err);
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup interval after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Email Spam Scorer</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">Generate Test Email Address</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={emailAddress}
              readOnly
              className="flex-1 bg-gray-700 rounded px-4 py-2"
              placeholder="Your test email will appear here"
            />
            <button
              onClick={generateEmail}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {emailAddress && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Received Emails</h2>
            {emails.length === 0 ? (
              <p className="text-gray-400">Waiting for emails...</p>
            ) : (
              <div className="space-y-4">
                {emails.map((email) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{email.subject}</h3>
                        <p className="text-sm text-gray-400">From: {email.from}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          email.score >= 80 ? 'text-green-500' :
                          email.score >= 60 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {email.score}/100
                        </div>
                        <p className="text-sm text-gray-400">Spam Score</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Analysis Details:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {email.analysis.issues.map((issue, index) => (
                          <li key={index} className="text-red-400">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
