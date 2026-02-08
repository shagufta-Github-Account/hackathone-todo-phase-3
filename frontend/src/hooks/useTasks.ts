import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Task } from '@/lib/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.tasks.getAll();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (title: string, description?: string) => {
    try {
      const task = await api.tasks.create({ title, description: description || '' });
      setTasks((prev) => [task, ...prev]);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
      return false;
    }
  }, []);

  const updateTask = useCallback(async (
    id: number,
    data: { title?: string; description?: string; is_completed?: boolean }
  ) => {
    try {
      const updated = await api.tasks.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      return false;
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await api.tasks.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      return false;
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    clearError,
  };
}
