'use client';

import { useState } from 'react';

interface RegisterFormProps {
  onRegister: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string;
}

export function RegisterForm({ onRegister, loading, error }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-xl outline-none transition-all"
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid transparent',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className="w-full px-4 py-3 rounded-xl outline-none transition-all"
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid transparent',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full font-medium py-3 rounded-xl transition-colors"
        style={{
          backgroundColor: '#8B5CF6',
          color: '#FFFFFF',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8B5CF6'}
      >
        {loading ? 'Please wait...' : 'Create Account'}
      </button>

      {error && (
        <p className="text-sm text-center" style={{ color: '#EF4444' }}>
          {error}
        </p>
      )}
    </form>
  );
}
