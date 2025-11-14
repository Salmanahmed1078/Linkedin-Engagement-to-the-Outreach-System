import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to update DM approval status and feedback in Google Sheets
 * 
 * Note: This is a placeholder. In production, you would need to:
 * 1. Use Google Sheets API with proper authentication
 * 2. Or use a service like n8n to update the sheet
 * 3. Or use a database instead of Google Sheets
 * 
 * For now, this route will log the update and return success.
 * The actual Google Sheet update should be handled by your n8n workflow
 * or another backend service.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rowId, approval, feedback, postUrl, dmData } = body;

    console.log('DM Update Request:', {
      rowId,
      approval,
      feedback,
      postUrl,
      hasDMData: !!dmData,
    });

    // Validate required fields
    if (!rowId || !approval) {
      return NextResponse.json(
        { error: 'Missing required fields: rowId, approval' },
        { status: 400 }
      );
    }

    // Validate approval status
    const validApprovals = ['Pending Review', 'Approved', 'Needs Revision', 'Regenerated'];
    if (!validApprovals.includes(approval)) {
      return NextResponse.json(
        { error: 'Invalid approval status' },
        { status: 400 }
      );
    }

    // TODO: In production, update Google Sheet here
    // For now, we'll just log and return success
    // The actual update should be done via:
    // 1. Google Sheets API (requires OAuth/service account)
    // 2. n8n workflow webhook
    // 3. Or another backend service

    console.log('DM Update (would update Google Sheet):', {
      rowId,
      approval,
      feedback: feedback || '',
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'DM status updated successfully',
      data: {
        rowId,
        approval,
        feedback,
      },
    });
  } catch (error) {
    console.error('Error updating DM status:', error);
    return NextResponse.json(
      { error: 'Failed to update DM status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

