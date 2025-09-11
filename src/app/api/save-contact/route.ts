import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface ContactData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  timestamp: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const contactData: ContactData = await request.json();
    
    // Validate required fields
    if (!contactData.fullName || !contactData.email || !contactData.message) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, and message are required' },
        { status: 400 }
      );
    }

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Path to contacts file
    const contactsFile = path.join(dataDir, 'contacts.json');
    
    // Read existing contacts or initialize empty array
    let contacts: ContactData[] = [];
    try {
      const fileContent = await fs.readFile(contactsFile, 'utf-8');
      contacts = JSON.parse(fileContent);
    } catch {
      // File doesn't exist or is invalid, start with empty array
      contacts = [];
    }

    // Add the new contact with a unique ID
    const newContact: ContactData & { id: string } = {
      ...contactData,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: contactData.timestamp || new Date().toISOString()
    };

    contacts.push(newContact);

    // Write back to file
    await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2), 'utf-8');

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact saved successfully',
        id: newContact.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}