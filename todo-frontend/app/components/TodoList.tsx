'use client';

import { useEffect, useState } from 'react';
import { Todo } from '../types';
import { getAllTodos } from '../api/todoApi';
import TodoItem from './TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getAllTodos();
      setTodos(data);
      setError('');
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('ToDoの取得に失敗しました。再読み込みをお試しください。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          onClick={fetchTodos}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          再読み込み
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-md">
        <p className="text-gray-500">ToDo項目はありません。新しいタスクを追加してください。</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">ToDo一覧</h2>
      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={fetchTodos}
            onDelete={fetchTodos}
          />
        ))}
      </div>
    </div>
  );
}