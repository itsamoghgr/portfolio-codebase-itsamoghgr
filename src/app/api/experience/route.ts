import { NextResponse } from 'next/server';
import { DataManager } from '@/lib/dataManager';

export async function GET() {
  try {
    const experiences = DataManager.getExperiences();
    return NextResponse.json({ experiences });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const experienceData = await request.json();
    const newExperience = DataManager.addExperience(experienceData);
    return NextResponse.json({ experience: newExperience }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const updatedExperience = DataManager.updateExperience(id, updates);
    
    if (!updatedExperience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json({ experience: updatedExperience });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const deleted = DataManager.deleteExperience(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}