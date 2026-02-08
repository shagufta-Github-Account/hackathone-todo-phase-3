'use client';

import { useState, useEffect, useRef } from 'react';
import type { Task } from '@/lib/types';

interface EditTaskModalProps {
  task: Task;
  onSave: (id: number, title: string, description: string) => Promise<boolean>;
  onCancel: () => void;
}

export function EditTaskModal({ task, onSave, onCancel }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await onSave(task.id, title.trim(), description.trim());
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
          Edit Task
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Title
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all"
              style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid transparent',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 py-2.5 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#8B5CF6' }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 font-medium rounded-xl transition-colors hover:bg-gray-100"
              style={{ color: '#6B7280' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
