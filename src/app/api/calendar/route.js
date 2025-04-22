import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request) {
  try {
    const { credential } = await request.json();
    
    if (!credential) {
      return Response.json({ error: 'No credential provided' }, { status: 400 });
    }

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client();
    
    // Set credentials directly with access token
    oauth2Client.setCredentials({
      access_token: credential
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    console.log('Fetching calendar events...');
    
    // Fetch events from the primary calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('Calendar response:', response.data);

    // Filter events that start with "todo"
    const todoEvents = response.data.items.filter(event => 
      event.summary?.toLowerCase().startsWith('todo')
    ).map(event => ({
      id: event.id,
      summary: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description || ''
    }));

    console.log('Filtered todo events:', todoEvents);

    return Response.json({ todos: todoEvents });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    return Response.json({ 
      error: 'Failed to fetch calendar events',
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
} 