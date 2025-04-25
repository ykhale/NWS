import { NextResponse } from 'next/server';
// Remove the import to test if that's causing the issue
// import { sendWeatherAlertEmail } from '@/lib/emailService';

// Simplified GET handler with no dependencies
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Email API is running' 
  });
}

// Simplified POST handler with no dependencies
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({ 
      status: 'ok',
      message: 'Request received', 
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to process request'
      },
      { status: 400 }
    );
  }
} 