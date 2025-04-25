import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Email API is running' });
}

export async function POST() {
  return NextResponse.json({ message: 'Email API received POST request' });
} 