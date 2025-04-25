import { NextResponse } from 'next/server';
import { sendWeatherAlertEmail } from '@/lib/emailService';

export async function GET() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Email service not configured' },
        { status: 503 }
      );
    }
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Email API is running',
      service: 'resend'
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Service check failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Email service not configured' },
        { status: 503 }
      );
    }

    const { email, alert } = await request.json();

    if (!email || !alert) {
      return NextResponse.json(
        { status: 'error', message: 'Email and alert data are required' },
        { status: 400 }
      );
    }

    await sendWeatherAlertEmail(email, alert);
    
    return NextResponse.json({ 
      status: 'ok',
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 