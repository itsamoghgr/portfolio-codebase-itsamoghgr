import { NextResponse } from 'next/server';
import { DataManager } from '@/lib/dataManager';

export async function GET() {
  try {
    const projects = DataManager.getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const projectData = await request.json();
    const newProject = DataManager.addProject(projectData);
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const updatedProject = DataManager.updateProject(id, updates);
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const deleted = DataManager.deleteProject(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}