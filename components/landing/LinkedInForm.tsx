'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const WEBHOOK_URL = '/api/campaign/start';
const LINKEDIN_URL_PATTERN = /^https?:\/\/(www\.)?linkedin\.com\/.*/i;

export default function LinkedInForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const validateLinkedInUrl = (urlValue: string): { valid: boolean; message?: string; url?: string } => {
    if (!urlValue || urlValue.trim() === '') {
      return { valid: false, message: 'Please enter a LinkedIn post URL' };
    }

    const trimmedUrl = urlValue.trim();

    if (!LINKEDIN_URL_PATTERN.test(trimmedUrl)) {
      return { valid: false, message: 'Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/posts/...)' };
    }

    if (!trimmedUrl.includes('/posts/') && !trimmedUrl.includes('/activity-')) {
      return { valid: false, message: 'Please enter a LinkedIn post URL (should contain /posts/ or /activity-)' };
    }

    return { valid: true, url: trimmedUrl };
  };

  const submitToWebhook = async (linkedinUrl: string) => {
    try {
      const payload = {
        postIds: [linkedinUrl]
      };
      
      console.log('Submitting to webhook:', WEBHOOK_URL);
      console.log('Payload:', payload);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      // Read response as text first, then try to parse as JSON
      const responseText = await response.text();
      let responseData: any = {};
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        // If not JSON, treat as plain text response
        responseData = { message: responseText || 'Response received' };
      }

      console.log('Response data:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.details || responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`;
        console.error('Error response:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Success response:', responseData);
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Webhook submission error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validation = validateLinkedInUrl(url);

    if (!validation.valid) {
      setError(validation.message || 'Invalid URL');
      return;
    }

    setLoading(true);

    try {
      await submitToWebhook(validation.url!);
      setSuccess('Campaign started! Redirecting...');
      
      // Redirect to campaign started page
      setTimeout(() => {
        router.push('/campaign-started');
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      let errorMessage = 'Something went wrong. Please try again.';
      
      // Parse error message from response
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        // Use the error message from the API response
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
      <div className="bg-white rounded-2xl shadow-xl shadow-cyan-500/5 border border-slate-200/60 p-2 flex flex-col sm:flex-row gap-2 transition-all duration-300">
        <div className="flex-1">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
              setSuccess('');
            }}
            placeholder="Paste your LinkedIn post URL here..."
            required
            className="w-full px-6 py-4 text-slate-900 placeholder-slate-400 bg-transparent border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-base"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-white font-semibold px-8 py-4 rounded-xl whitespace-nowrap hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span>Starting Campaign...</span>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            <>
              <span>Start Campaign</span>
              <svg className="inline-block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </>
          )}
        </button>
      </div>
      
      {/* Message Container */}
      {(error || success) && (
        <div className={`mt-4 p-4 rounded-xl ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <p className={`text-sm font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
            {error || success}
          </p>
        </div>
      )}
    </form>
  );
}
