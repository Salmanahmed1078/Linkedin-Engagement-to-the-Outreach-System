'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { getCredentials, saveCredentials, verifyLogin } from '@/lib/auth';

interface LoginModalProps {
  onLoginSuccess?: () => void;
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setError('');
    if (usernameRef.current) usernameRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
  };

  useEffect(() => {
    // Clear form fields on mount (especially after logout)
    clearForm();
    setSetupUsername('');
    setSetupPassword('');
    setLoading(false);

    // Check if credentials exist
    const checkCredentials = async () => {
      const credentials = await getCredentials();
      setShowSetup(!credentials);
    };
    checkCredentials();

    // Note: Browser autofill prevention is handled by:
    // 1. Clearing state on mount (above)
    // 2. Hidden fake fields in the form
    // 3. autoComplete="off" attributes
    // 4. Clear button if user needs to manually clear autofilled values
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyLogin(username, password);
      
      if (result.success) {
        // Reload page to show main content
        window.location.reload();
      } else {
        setError(result.message || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleSetup = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (setupUsername.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (setupPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    // Save credentials
    saveCredentials(setupUsername.trim(), setupPassword);
    
    // Set logged in
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatwalrus_loggedIn', 'true');
    }

    // Reload page to show main content
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to ChatWalrus</h2>
          <p className="text-slate-600">
            {showSetup ? 'Create your account to get started' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        {!showSetup && (
          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            {/* Hidden fake fields to prevent browser autofill */}
            <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                  Username
                </label>
                {username && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                ref={usernameRef}
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                onInput={(e) => {
                  // Handle browser autofill by syncing state
                  const target = e.target as HTMLInputElement;
                  if (target.value !== username) {
                    setUsername(target.value);
                  }
                }}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                placeholder="Enter your username"
                autoComplete="off"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onInput={(e) => {
                  // Handle browser autofill by syncing state
                  const target = e.target as HTMLInputElement;
                  if (target.value !== password) {
                    setPassword(target.value);
                  }
                }}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                placeholder="Enter your password"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Setup Form */}
        {showSetup && (
          <div>
            <form onSubmit={handleSetup} className="space-y-4">
              <div>
                <label htmlFor="setupUsername" className="block text-sm font-semibold text-slate-700 mb-2">
                  Choose Username
                </label>
                <input
                  type="text"
                  id="setupUsername"
                  value={setupUsername}
                  onChange={(e) => {
                    setSetupUsername(e.target.value);
                    setError('');
                  }}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="setupPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Choose Password
                </label>
                <input
                  type="password"
                  id="setupPassword"
                  value={setupPassword}
                  onChange={(e) => {
                    setSetupPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  placeholder="Choose a password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-all"
              >
                Create Account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
