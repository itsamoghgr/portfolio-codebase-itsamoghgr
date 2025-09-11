import { NextResponse } from 'next/server';
import { DataManager } from '@/lib/dataManager';

export async function GET() {
  try {
    const personal = DataManager.getPersonalInfo();
    return NextResponse.json({ personal });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch personal info' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const updatedPersonal = DataManager.updatePersonalInfo(updates);
    return NextResponse.json({ personal: updatedPersonal });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update personal info' }, { status: 500 });
  }
}