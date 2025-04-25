import { NextResponse } from 'next/server';
import { sendWelcomeEmail, sendWeatherAlertEmail } from '@/lib/emailService';

export async function GET() {
  return NextResponse.json({ message: 'Email API is running' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    if (!type || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: type and to' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'welcome':
        if (!data?.states || !Array.isArray(data.states)) {
          return NextResponse.json(
            { error: 'Missing or invalid states data for welcome email' },
            { status: 400 }
          );
        }
        await sendWelcomeEmail(to, data.states);
        break;

      case 'alert':
        if (!data?.event || !data?.areaDesc || !data?.severity || !data?.description || !data?.effective || !data?.expires) {
          return NextResponse.json(
            { error: 'Missing required alert data' },
            { status: 400 }
          );
        }
        await sendWeatherAlertEmail(to, data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 