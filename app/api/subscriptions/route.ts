import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Subscriptions API is running' });
}

export async function POST() {
  return NextResponse.json({ message: 'Subscription request received' });
} 