'use client';

import { useEffect, useState } from 'react';
import { isLoggedIn } from '@/lib/auth';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Footer from '@/components/landing/Footer';
import LoginModal from '@/components/auth/LoginModal';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check login state on mount
    const checkAuth = () => {
      setLoggedIn(isLoggedIn());
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!loggedIn) {
    return <LoginModal onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <Navbar />
      <Hero />
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent max-w-7xl mx-auto my-20"></div>
      <HowItWorks />
      <Footer />
    </div>
  );
}

