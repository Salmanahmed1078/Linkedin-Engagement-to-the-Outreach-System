import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = 'https://chatwalrus.app.n8n.cloud/webhook/fa415421-7caf-4790-a0eb-f52f68e806c1';

/**
 * API Route to start a campaign by sending LinkedIn post URL to n8n webhook
 * This route handles the webhook call server-side to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postIds } = body;

    console.log('Campaign Start Request:', {
      postIds,
    });

    // Validate required fields
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid postIds array' },
        { status: 400 }
      );
    }

    // Prepare payload for webhook
    const payload = {
      postIds,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending to webhook:', WEBHOOK_URL);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Send to n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Webhook response status:', response.status);
      console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

      // n8n webhooks can return 200, 201, or other success codes
      // Also handle cases where n8n returns empty response
      const responseText = await response.text();
      console.log('Webhook raw response:', responseText);

      let responseData = {};
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          // If response is not JSON, that's okay - n8n sometimes returns empty or plain text
          console.log('Webhook returned non-JSON response, treating as success');
          responseData = { message: responseText || 'Webhook triggered successfully' };
        }
      }

      // Consider 2xx status codes as success
      if (response.status >= 200 && response.status < 300) {
        console.log('Webhook success response:', responseData);
        return NextResponse.json({
          success: true,
          message: 'Campaign started successfully - n8n automation triggered',
          data: responseData,
        });
      } else {
        // Non-2xx status code
        console.error('Webhook error response:', responseText);
        return NextResponse.json(
          { 
            error: 'Failed to start campaign', 
            details: `Webhook returned status ${response.status}: ${responseText || response.statusText}` 
          },
          { status: response.status }
        );
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Webhook request timed out after 30 seconds');
        return NextResponse.json(
          { 
            error: 'Request timeout', 
            details: 'The webhook did not respond within 30 seconds. The automation may still be processing.' 
          },
          { status: 504 }
        );
      }
      
      console.error('Webhook fetch error:', fetchError);
      throw fetchError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Error starting campaign:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start campaign', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
