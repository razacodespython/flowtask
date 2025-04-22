import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request) {
  try {
    const { accessToken, eventId } = await request.json();

    if (!accessToken || !eventId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Create calendar client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get the event
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId
    });

    // Update the event to mark it as completed
    const updatedEvent = await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: {
        ...event.data,
        summary: `✅ ${event.data.summary}`,
        colorId: '2' // Green color for completed tasks
      }
    });

    return new Response(JSON.stringify({ success: true, event: updatedEvent.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to complete task',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 