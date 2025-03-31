import { NextResponse } from 'next/server';
import { Email } from '../../../lib/email-adapter';

export async function GET(request) {
  try {
    // Get emails from database
    const emails = await Email.find({});
    
    // Sort emails by createdAt in descending order (newest first)
    const sortedEmails = emails.sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    
    // Return emails
    return NextResponse.json(sortedEmails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
} 