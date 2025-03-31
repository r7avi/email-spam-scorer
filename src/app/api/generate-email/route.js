import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    // Generate a random 16-character hex string
    const randomId = crypto.randomBytes(8).toString('hex');
    
    // Create the email address with the random ID
    const emailAddress = `${randomId}@cloudpanels.store`;
    
    // Return the generated email address
    return NextResponse.json({ emailAddress });
  } catch (error) {
    console.error('Error generating email address:', error);
    return NextResponse.json(
      { error: 'Failed to generate email address' },
      { status: 500 }
    );
  }
} 