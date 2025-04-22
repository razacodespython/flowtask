import { google } from 'googleapis';

export async function POST(request) {
  try {
    const { summary, description, visibility = 'private', accessToken } = await request.json();

    console.log('Received calendar creation request:', {
      hasSummary: !!summary,
      hasDescription: !!description,
      visibility,
      hasAccessToken: !!accessToken,
      tokenLength: accessToken?.length
    });

    if (!accessToken) {
      console.error('No access token provided');
      return new Response(JSON.stringify({ 
        error: 'No access token provided',
        code: 'MISSING_TOKEN'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!summary) {
      console.error('No summary provided');
      return new Response(JSON.stringify({ 
        error: 'Summary is required',
        code: 'MISSING_SUMMARY'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Verify the token is valid and get token info
    try {
      const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
      console.log('Token info:', {
        email: tokenInfo.email,
        scopes: tokenInfo.scopes,
        expires_in: tokenInfo.expires_in
      });
    } catch (error) {
      console.error('Token validation failed:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
      return new Response(JSON.stringify({ 
        error: 'Invalid or expired access token',
        details: error.message,
        code: 'INVALID_TOKEN'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        timeZone: 'UTC',
      },
      visibility: visibility,
    };

    console.log('Creating calendar event:', event);

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Calendar event created successfully:', response.data);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      code: error.code,
      status: error.status
    });
    
    // Handle specific Google API errors
    if (error.code === 401) {
      return new Response(JSON.stringify({ 
        error: 'Authentication failed',
        details: 'Please sign in again',
        code: 'AUTH_FAILED'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error.code === 403) {
      return new Response(JSON.stringify({ 
        error: 'Insufficient permissions',
        details: 'Please ensure you have granted calendar access',
        code: 'INSUFFICIENT_PERMISSIONS'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to create calendar event',
      details: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      response: error.response?.data
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 