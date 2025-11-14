'use client';

import { useState, FormEvent } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => Promise<void>;
  dmEntry: {
    'First Name': string;
    'Last Name': string;
    Company: string;
    DM: string;
  } | null;
  loading?: boolean;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, dmEntry, loading = false }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');

  if (!isOpen || !dmEntry) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(feedback);
    setFeedback('');
  };

  const handleClose = () => {
    setFeedback('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center px-6 py-12" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">Request Revision</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* DM Preview */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-2">DM Message for</p>
            <p className="text-sm font-semibold text-slate-900 mb-1">
              {dmEntry['First Name']} {dmEntry['Last Name']}
            </p>
            <p className="text-xs text-slate-600 mb-3">{dmEntry.Company}</p>
            <div className="bg-white rounded border border-slate-200 p-3">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{dmEntry.DM}</p>
            </div>
          </div>

          {/* Feedback Input */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-2">
              Revision Feedback <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add your feedback or revision comments here... (e.g., Make it more personalized, Add a call-to-action, etc.)"
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">
              This feedback will be sent to the webhook for DM regeneration
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Request Revision'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

