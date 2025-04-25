import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { sendWelcomeEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const { email, states } = await request.json();

    if (!email || !states || !Array.isArray(states) || states.length === 0) {
      return NextResponse.json(
        { error: 'Email and states are required' },
        { status: 400 }
      );
    }

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { email },
      update: { states: states },
      create: { 
        email, 
        states: states 
      },
    });

    // Comment out email sending for now to isolate the issue
    // await sendWelcomeEmail(email, states);

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error handling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      const subscription = await prisma.subscription.findUnique({
        where: { email },
      });
      return NextResponse.json(subscription);
    }

    const subscriptions = await prisma.subscription.findMany();
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
} 