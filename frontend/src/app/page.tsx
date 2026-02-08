'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/hooks/useAuth';

type AuthView = 'login' | 'register';
type PageView = 'landing' | 'auth' | 'dashboard';

export default function HomePage() {
  const [view, setView] = useState<PageView>('landing');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isMounted, setIsMounted] = useState(false);
  const { user, login, register, logout, loading, error, setError } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (user) {
    return <Dashboard user={user.email} onLogout={logout} />;
  }

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('auth')} />;
  }

  return <AuthPage
    authView={authView}
    setAuthView={setAuthView}
    login={login}
    register={register}
    loading={loading}
    error={error}
    setError={setError}
  />;
}

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Easy Task Management',
      description: 'Create, edit, and delete tasks with just a few clicks. Keep track of everything you need to do.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Stay On Track',
      description: 'Filter by all, active, or completed tasks to focus on what matters right now.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure & Private',
      description: 'Your data is protected with secure authentication. Only you can access your tasks.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Real-time Updates',
      description: 'See changes instantly across all your devices. Your tasks are always up to date.',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF6' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#1F2937' }}>TodoApp</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-5 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: '#6B7280' }}
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2 text-sm font-medium rounded-lg transition-colors text-white"
              style={{ backgroundColor: '#8B5CF6' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-6" style={{ color: '#1F2937' }}>
            Manage Your Tasks
            <br />
            <span style={{ color: '#8B5CF6' }}>With Ease</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
            A simple, secure todo application that helps you stay organized.
            Built for a fast, modern workflow across devices.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 text-lg font-medium rounded-xl transition-all transform hover:scale-105 text-white shadow-lg"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1F2937' }}>
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#F3E8FF' }}
              >
                <div style={{ color: '#8B5CF6' }}>{feature.icon}</div>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2937' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6B7280' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1F2937' }}>
            Ready to Get Organized?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#6B7280' }}>
            Join thousands of users who trust TodoApp to manage their daily tasks.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 text-lg font-medium rounded-xl transition-all transform hover:scale-105 text-white shadow-lg"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            Start Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center" style={{ color: '#9CA3AF' }}>
          <p>&copy; 2025 TodoApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface AuthPageProps {
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string;
  setError: (error: string) => void;
}

function AuthPage({ authView, setAuthView, login, register, loading, error, setError }: AuthPageProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FAFAFA' }}
    >
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 animate-scale-in">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <button onClick={() => window.location.reload()} className="cursor-pointer">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
              style={{ backgroundColor: '#8B5CF6' }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#1F2937' }}>
          TodoApp
        </h1>
        <p className="text-center mb-8" style={{ color: '#6B7280' }}>
          {authView === 'login' ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
        </p>

        {/* Auth Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => {
              setAuthView('login');
              setError('');
            }}
            className="flex-1 py-3 font-medium text-sm transition-all rounded-xl"
            style={{
              backgroundColor: authView === 'login' ? '#8B5CF6' : 'transparent',
              color: authView === 'login' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setAuthView('register');
              setError('');
            }}
            className="flex-1 py-3 font-medium text-sm transition-all rounded-xl"
            style={{
              backgroundColor: authView === 'register' ? '#8B5CF6' : 'transparent',
              color: authView === 'register' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        {authView === 'login' ? (
          <LoginForm onLogin={login} loading={loading} error={error} />
        ) : (
          <RegisterForm onRegister={register} loading={loading} error={error} />
        )}
      </div>
    </div>
  );
}
