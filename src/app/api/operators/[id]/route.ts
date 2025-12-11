import { NextResponse } from 'next/server';
import { getOperatorById, updateOperator, deleteOperator } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const operator = getOperatorById(params.id);
    if (!operator) {
      return NextResponse.json(
        { error: 'Operator not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(operator);
  } catch (error) {
    console.error('Error fetching operator:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operator' },
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
    const updated = updateOperator(params.id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: 'Operator not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating operator:', error);
    return NextResponse.json(
      { error: 'Failed to update operator' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteOperator(params.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Operator not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting operator:', error);
    return NextResponse.json(
      { error: 'Failed to delete operator' },
      { status: 500 }
    );
  }
}
