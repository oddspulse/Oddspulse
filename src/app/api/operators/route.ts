import { NextResponse } from 'next/server';
import { getAllOperators, createOperator } from '@/lib/operatorsDb';
import { Operator } from '@/lib/types';

export async function GET() {
  try {
    const operators = getAllOperators();
    return NextResponse.json(operators);
  } catch (error) {
    console.error('Error fetching operators:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operators' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const operator: Operator = await request.json();
    const created = createOperator(operator);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating operator:', error);
    return NextResponse.json(
      { error: 'Failed to create operator' },
      { status: 500 }
    );
  }
}
