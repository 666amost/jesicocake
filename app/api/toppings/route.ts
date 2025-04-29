import { NextResponse } from 'next/server';
import { getToppings } from '@/lib/db';

export async function GET() {
  try {
    const toppings = await getToppings();
    return NextResponse.json(toppings);
  } catch (error) {
    console.error('Error fetching toppings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch toppings' },
      { status: 500 }
    );
  }
} 