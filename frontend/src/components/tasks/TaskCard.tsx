'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <div
        className="group bg-white rounded-2xl transition-all hover:shadow-md"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          opacity: task.is_completed ? 0.6 : 1,
        }}
      >
        <div className="flex items-start gap-4 p-5">
          {/* Complete Checkbox */}
          <button
            onClick={onToggleComplete}
            className="flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all mt-0.5"
            style={{
              backgroundColor: task.is_completed ? '#8B5CF6' : 'transparent',
              borderColor: task.is_completed ? '#8B5CF6' : '#D1D5DB',
            }}
          >
            {task.is_completed && (
              <svg className="w-4 h-4 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-medium text-base mb-1"
              style={{
                color: '#1F2937',
                textDecoration: task.is_completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  textDecoration: task.is_completed ? 'line-through' : 'none',
                }}
              >
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-2 rounded-xl transition-colors hover:bg-purple-50"
              style={{ color: '#6B7280' }}
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="p-2 rounded-xl transition-colors hover:bg-red-50"
              style={{ color: '#6B7280' }}
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2937' }}>
              Delete Task
            </h3>
            <p className="mb-6" style={{ color: '#6B7280' }}>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onDelete(task);
                  setIsDeleting(false);
                }}
                className="flex-1 py-2.5 text-white font-medium rounded-xl transition-colors"
                style={{ backgroundColor: '#EF4444' }}
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-2.5 font-medium rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: '#6B7280' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
