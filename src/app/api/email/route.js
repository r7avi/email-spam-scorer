import { NextResponse } from 'next/server';
import { Email } from '@/models/Email';
import { EmailAnalyzer } from '@/services/emailAnalyzer';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.type === 'generate') {
      // Generate a random email address
      const randomString = crypto.randomBytes(8).toString('hex');
      const emailAddress = `${randomString}@cloudpanels.store`;
      
      return NextResponse.json({ address: emailAddress });
    }
    
    if (data.type === 'receive') {
      // Process received email
      const emailData = {
        id: crypto.randomBytes(16).toString('hex'),
        address: data.to,
        from: data.from,
        subject: data.subject,
        content: data.content,
        headers: data.headers
      };

      // Analyze the email
      const analysis = EmailAnalyzer.analyzeEmail(emailData);
      emailData.score = analysis.score;
      emailData.analysis = analysis;

      // Store in database
      const email = await Email.create(emailData);
      
      return NextResponse.json({ success: true, email });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const emails = await Email.findByAddress(address);
    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 