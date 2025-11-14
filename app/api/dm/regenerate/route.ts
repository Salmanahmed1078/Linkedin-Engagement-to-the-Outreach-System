import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = 'https://chatwalrus.app.n8n.cloud/webhook/fa415421-7caf-4790-a0eb-f52f68e806c1';

/**
 * API Route to send revision request to n8n webhook
 * Sends DM data, post information, and feedback to the webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postUrl, postTopic, dmData, feedback } = body;

    console.log('DM Regeneration Request:', {
      postUrl,
      postTopic,
      hasDMData: !!dmData,
      hasFeedback: !!feedback,
    });

    // Validate required fields
    if (!postUrl || !dmData) {
      return NextResponse.json(
        { error: 'Missing required fields: postUrl, dmData' },
        { status: 400 }
      );
    }

    // Prepare payload for webhook
    const payload = {
      postUrl,
      postTopic: postTopic || '',
      dmData: {
        firstName: dmData['First Name'] || '',
        lastName: dmData['Last Name'] || '',
        company: dmData.Company || '',
        role: dmData.Role || '',
        headline: dmData.Headline || '',
        about: dmData.About || '',
        dm: dmData.DM || '',
        profileUrl: dmData['Profile URL'] || '',
      },
      feedback: feedback || '',
      timestamp: new Date().toISOString(),
    };

    console.log('Sending to webhook:', WEBHOOK_URL);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Send to n8n webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Webhook response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json().catch(() => ({}));
    console.log('Webhook success response:', responseData);

    return NextResponse.json({
      success: true,
      message: 'Revision request sent successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('Error sending revision request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send revision request', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

