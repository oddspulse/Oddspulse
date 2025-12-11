import { NextResponse } from 'next/server';
import { getAllSlots, createSlot } from '@/lib/slotsDb';
import { SlotGame } from '@/lib/types';

export async function GET() {
  try {
    const slots = getAllSlots();
    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slots' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const slot: SlotGame = await request.json();
    const created = createSlot(slot);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating slot:', error);
    return NextResponse.json(
      { error: 'Failed to create slot' },
      { status: 500 }
    );
  }
}
