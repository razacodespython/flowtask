'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>FlowTask</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com" async></script>
      </head>
      <body>
        <GoogleOAuthProvider 
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          onScriptLoadError={() => console.error('Failed to load Google OAuth script')}
          onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}