'use client';

import { useState, useRef } from 'react';

interface AddTaskFormProps {
  onAdd: (title: string, description?: string) => Promise<boolean>;
  loading: boolean;
}

export function AddTaskForm({ onAdd, loading }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const success = await onAdd(title.trim(), description.trim() || undefined);
    if (success) {
      setTitle('');
      setDescription('');
      setShowDescription(false);
      titleInputRef.current?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-6 py-4 pr-14 bg-white rounded-2xl shadow-sm border-0 outline-none transition-all placeholder:text-gray-400"
          style={{
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors disabled:opacity-40"
          style={{ backgroundColor: '#8B5CF6' }}
        >
          {loading ? (
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      {/* Description field - shows when user starts typing */}
      {showDescription || title.length > 0 ? (
        <div className="mt-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            rows={2}
            className="w-full px-4 py-3 bg-white rounded-xl border-0 outline-none resize-none text-sm transition-all"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="mt-3 text-sm flex items-center gap-1 transition-colors"
          style={{ color: '#6B7280' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add description
        </button>
      )}
    </form>
  );
}
