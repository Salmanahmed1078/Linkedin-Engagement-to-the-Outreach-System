# DM Approval Workflow - Design Document

## Overview
Interactive approval workflow for DM messages with the following actions:
- **Approve**: Mark as approved (no additional action)
- **Regenerate**: Mark as regenerated (through ChatGPT)
- **Needs Revision**: Send to webhook with feedback for regeneration

## Requirements

### Approval Actions
1. **Approve**
   - Change status to "Approved"
   - Update Google Sheet
   - No webhook call needed

2. **Regenerate**
   - Change status to "Regenerated"
   - Update Google Sheet
   - Show message: "DM is regenerated through ChatGPT"
   - No webhook call needed

3. **Needs Revision**
   - Open feedback modal
   - Feedback is optional
   - Send data to webhook: `https://chatwalrus.app.n8n.cloud/webhook-test/DMRegeneration`
   - Method: POST
   - Payload includes:
     - Post URL
     - Post Topic
     - All DM data (name, company, role, headline, about, DM message, profile URL)
     - Feedback (optional)
   - Update Google Sheet with status and feedback

### Default Status
- **Pending Review**: Default status for all new DMs

## UI Design

### Table View
- **Approval Column**: Interactive dropdown/action buttons
  - Current status badge (colored)
  - Action menu (three-dot button or dropdown)
  - Actions: Approve, Regenerate, Needs Revision

### Feedback Modal
- Opens when "Needs Revision" is clicked
- Shows DM preview
- Text area for feedback (optional)
- Submit button to send to webhook
- Cancel button

### Visual Feedback
- Loading states during updates
- Toast notifications for success/error
- Status badges with colors:
  - Pending Review: Yellow
  - Approved: Green
  - Needs Revision: Red
  - Regenerated: Blue

## Implementation Plan

### 1. API Routes
- `/api/dm/update` - Update approval status and feedback in Google Sheet
- `/api/dm/regenerate` - Send revision request to webhook

### 2. Components
- `FeedbackModal` - Modal for revision feedback
- Approval action buttons/dropdown in DM table
- Toast notification component

### 3. State Management
- Local state for DM data updates
- Loading states for each action
- Toast messages for user feedback

### 4. Webhook Integration
- Send POST request to n8n webhook
- Include all required data in payload
- Handle errors gracefully

## Deliverables

1. ✅ Feedback Modal Component
2. ✅ API Routes (update, regenerate)
3. ✅ Approval Action Handlers
4. ✅ UI Integration in DM Table
5. ✅ Toast Notifications
6. ✅ Loading States
7. ✅ Error Handling

## Next Steps

1. Integrate approval actions in DM table
2. Add toast notifications
3. Test webhook integration
4. Update Google Sheets integration (requires backend service)

