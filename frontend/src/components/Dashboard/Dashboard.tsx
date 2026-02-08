'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskList, AddTaskForm, EditTaskModal } from '@/components/tasks';
import type { Task } from '@/lib/types';
import Chatbot from '@/components/chat/chatbot';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

type FilterType = 'all' | 'active' | 'completed';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask, clearError } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const pendingTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  const filteredTasks = filter === 'all'
    ? tasks
    : filter === 'active'
      ? pendingTasks
      : completedTasks;

  const handleToggleComplete = async (task: Task) => {
    await updateTask(task.id, { is_completed: !task.is_completed });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = async (task: Task) => {
    await deleteTask(task.id);
  };

  const handleSaveTask = async (id: number, title: string, description: string): Promise<boolean> => {
    const success = await updateTask(id, { title, description });
    if (success) {
      setEditingTask(null);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8B5CF6' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold" style={{ color: '#1F2937' }}>My Tasks</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block" style={{ color: '#6B7280' }}>{user}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-purple-50"
              style={{ color: '#6B7280' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        <AddTaskForm onAdd={addTask} loading={loading} />

        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm flex-1" style={{ color: '#B91C1C' }}>{error}</p>
            <button onClick={clearError} style={{ color: '#EF4444' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 text-sm font-medium rounded-xl transition-all capitalize"
              style={{
                backgroundColor: filter === f ? '#8B5CF6' : 'transparent',
                color: filter === f ? '#FFFFFF' : '#6B7280',
              }}
            >
              {f}
              <span className="ml-2 opacity-70">
                {f === 'all' ? tasks.length : f === 'active' ? pendingTasks.length : completedTasks.length}
              </span>
            </button>
          ))}
        </div>

        {!loading && (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
            filter={filter}
          />
        )}
      </main>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {/* Chatbot integrated correctly here */}
      <Chatbot userId={user} />
      
    </div>
  );
}