'use client';

import { useCallback, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Link from 'next/link';

export default function Todos() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">ToDo アプリケーション</h1>
        <Link
          href="/dashboard"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          ダッシュボードに戻る
        </Link>
      </div>
      
      <div className="mb-8">
        <TodoForm onAdd={handleRefresh} />
      </div>
      
      <TodoList key={refreshKey} />
    </main>
  );
}