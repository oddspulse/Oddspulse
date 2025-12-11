import { NextResponse } from 'next/server';
import { getSlotById, updateSlot, deleteSlot } from '@/lib/slotsDb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slot = getSlotById(params.id);
    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(slot);
  } catch (error) {
    console.error('Error fetching slot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slot' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const updated = updateSlot(params.id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating slot:', error);
    return NextResponse.json(
      { error: 'Failed to update slot' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteSlot(params.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return NextResponse.json(
      { error: 'Failed to delete slot' },
      { status: 500 }
    );
  }
}
