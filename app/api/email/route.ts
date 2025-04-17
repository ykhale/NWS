import { NextResponse } from 'next/server';
import { sendWeatherAlertEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const { email, alert } = await request.json();

    if (!email || !alert) {
      return NextResponse.json(
        { error: 'Email and alert data are required' },
        { status: 400 }
      );
    }

    await sendWeatherAlertEmail(email, alert);
    
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 