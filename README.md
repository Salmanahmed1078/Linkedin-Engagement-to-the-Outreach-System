# ChatWalrus Dashboard

Next.js 14 application for ChatWalrus LinkedIn Automation platform.

## Features

- 📊 Dashboard Overview with campaign statistics
- 📝 LinkedIn Post Management
- 👥 All Leads Management with filtering
- 📤 Export Reports (CSV)
- 🎨 Modern UI with responsive design

## Getting Started

### Local Development

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
  - `dashboard/` - Main dashboard page
  - `api/` - API routes (campaign start, DM regenerate)
  - `page.tsx` - Landing page
- `components/` - React components
  - `DashboardClient.tsx` - Main dashboard component
  - `dashboard/Sidebar.tsx` - Navigation sidebar
  - `landing/` - Landing page components
- `lib/` - Utility functions and types
  - `google-sheets.ts` - Google Sheets data fetching
  - `types.ts` - TypeScript type definitions
  - `auth.ts` - Authentication utilities
- `public/` - Static assets

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js app
   - Click "Deploy"

   **That's it!** Vercel will automatically:
   - Build your Next.js app
   - Deploy it to production
   - Give you a production URL

3. **Environment Variables (if needed):**
   - If you add environment variables later, go to Project Settings → Environment Variables
   - Add any required variables (currently none needed)

### Important Notes

- ✅ **No environment variables needed** - Uses public Google Sheets
- ✅ **Automatic deployments** - Push to GitHub = auto-deploy on Vercel
- ✅ **Next.js 14** - Fully optimized for Vercel's platform

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data Source:** Google Sheets (public CSV export)

## Google Sheets Setup

The app reads from a public Google Sheet:
- Make sure your Google Sheet is set to "Anyone with the link can view"
- Sheet ID: Configured in `lib/google-sheets.ts`

## License

Private - All rights reserved

