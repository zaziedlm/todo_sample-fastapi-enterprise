'use client';

import { useCallback, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Link from 'next/link';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ToDo アプリケーション</h1>
        <Link
          href="/expenses/dashboard"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          経費管理
        </Link>
      </div>
      
      <div className="mb-8">
        <TodoForm onAdd={handleRefresh} />
      </div>
      
      <TodoList key={refreshKey} />
    </main>
  );
}
