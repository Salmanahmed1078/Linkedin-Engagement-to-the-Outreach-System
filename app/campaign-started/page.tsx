'use client';

import { useRouter } from 'next/navigation';

export default function CampaignStartedPage() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center animate-in fade-in zoom-in">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          <span className="gradient-text">Campaign Started!</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-light">
          Your system is now working. Your LinkedIn campaign has been successfully started.
        </p>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Campaign is Now Live</h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
              Your LinkedIn outreach campaign has been successfully initiated. Our system is now working 
              behind the scenes to connect you with the right decision-makers.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary text-white font-semibold py-3 px-6 rounded-xl"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-slate-700 font-semibold py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

