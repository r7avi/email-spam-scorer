'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
  const [emails, setEmails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [showAllEmails, setShowAllEmails] = useState(false);

  useEffect(() => {
    // Check for existing email in localStorage
    const checkAndSetTestEmail = async () => {
      const storedEmail = localStorage.getItem('testEmail');
      const storedTimestamp = localStorage.getItem('testEmailTimestamp');
      
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;
      
      // Check if stored email exists and is not expired
      if (storedEmail && storedTimestamp && (now - parseInt(storedTimestamp) < ONE_HOUR)) {
        setTestEmail(storedEmail);
      } else {
        try {
          const response = await axios.get('/api/generate-email');
          const newEmail = response.data.emailAddress;
          setTestEmail(newEmail);
          localStorage.setItem('testEmail', newEmail);
          localStorage.setItem('testEmailTimestamp', now.toString());
        } catch (err) {
          console.error('Error generating email address:', err);
          setError('Failed to generate test email address.');
        }
      }
    };

    checkAndSetTestEmail();
  }, []);

  useEffect(() => {
    if (testEmail) {
      fetchEmails();
      // Poll for new emails every 30 seconds
      const interval = setInterval(fetchEmails, 30000);
      return () => clearInterval(interval);
    }
  }, [testEmail]);

  const fetchEmails = async () => {
    if (!testEmail) return;
    
    try {
      setLoading(true);
      // Modified to include the test email as a query parameter
      const response = await axios.get(`/api/emails?email=${encodeURIComponent(testEmail)}`);
      setEmails(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Failed to load emails. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testEmail);
    alert('Email address copied to clipboard!');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-900 text-white">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Email Spam Scorer</h1>
          <p className="text-gray-400">Monitor and analyze your incoming emails for spam indicators</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Test Email</h2>
          <div className="flex flex-col space-y-4">
            <p className="text-gray-300">Send a test email to this address to see how our system analyzes it for spam.</p>
            
            <div className="flex flex-wrap gap-2 items-center">
              {testEmail ? (
                <>
                  <div className="flex-1 bg-gray-700 rounded px-3 py-2 min-w-[250px]">
                    <span className="font-mono">{testEmail}</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Copy
                  </button>
                </>
              ) : (
                <div className="text-gray-400">Generating your test email address...</div>
              )}
            </div>
            
            {testEmail && (
              <div className="text-gray-300 mt-2">
                <p>1. Send an email to this address from your email client</p>
                <p>2. Wait a few seconds for the system to process your email</p>
                <p>3. Results will appear automatically below</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 mb-4">1</div>
              <h3 className="text-xl font-medium mb-2">Receive Emails</h3>
              <p className="text-gray-300">Our system captures emails sent to your custom address</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 mb-4">2</div>
              <h3 className="text-xl font-medium mb-2">Analyze Content</h3>
              <p className="text-gray-300">Advanced algorithms scan for spam indicators</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 mb-4">3</div>
              <h3 className="text-xl font-medium mb-2">View Results</h3>
              <p className="text-gray-300">See detailed scores and analysis for each email</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Received Emails</h2>
          {loading ? (
            <p className="text-gray-400">Loading emails...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : !emails || emails.length === 0 ? (
            <p className="text-gray-400">Waiting for emails sent to {testEmail}...</p>
          ) : (
            <div className="space-y-4">
              {(() => {
                const filteredEmails = emails.filter(email => email.to === testEmail);
                
                if (filteredEmails.length === 0) {
                  return <p className="text-gray-400">No emails received yet for {testEmail}</p>;
                }

                const emailsToShow = showAllEmails ? filteredEmails : [filteredEmails[0]];

                return (
                  <>
                    {emailsToShow.map((email, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-medium">{email.subject || 'No Subject'}</h3>
                            <p className="text-gray-300">From: {email.from || 'Unknown Sender'}</p>
                            <p className="text-gray-300">To: {email.to || 'Unknown Recipient'}</p>
                          </div>
                          <div className="bg-gray-600 px-3 py-1 rounded-full">
                            <span className={email.score > 70 ? 'text-red-400' : email.score > 30 ? 'text-yellow-400' : 'text-green-400'}>
                              Score: {email.score || 0}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mt-2 truncate">{email.content}</p>
                        {email.analysis && (
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <h4 className="text-sm font-medium mb-1">Analysis:</h4>
                            <ul className="text-sm text-gray-300">
                              {Object.entries(email.analysis).map(([key, value]) => (
                                key !== 'score' && (
                                  <li key={key} className="flex justify-between">
                                    <span>{key}:</span>
                                    <span className={value ? 'text-red-400' : 'text-green-400'}>
                                      {value ? 'Detected' : 'Not Detected'}
                                    </span>
                                  </li>
                                )
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filteredEmails.length > 1 && (
                      <button
                        onClick={() => setShowAllEmails(!showAllEmails)}
                        className="mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded w-full"
                      >
                        {showAllEmails ? 'Hide Older Emails' : `Show ${filteredEmails.length - 1} Older Email${filteredEmails.length > 2 ? 's' : ''}`}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
