'use client';

import type { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  filter: 'all' | 'active' | 'completed';
}

export function TaskList({ tasks, onToggleComplete, onEdit, onDelete, filter }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#F3E8FF' }}
        >
          <svg className="w-12 h-12" style={{ color: '#A78BFA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1" style={{ color: '#1F2937' }}>
          {filter === 'all' ? 'No tasks yet' : filter === 'active' ? 'No pending tasks' : 'No completed tasks'}
        </h3>
        <p style={{ color: '#6B7280' }}>
          {filter === 'all' ? 'Add your first task above to get started' : 'Great job! Everything is done.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={() => onToggleComplete(task)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
