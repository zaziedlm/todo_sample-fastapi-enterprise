'use client';

import { useCallback, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">ToDo アプリケーション</h1>
      
      <div className="mb-8">
        <TodoForm onAdd={handleRefresh} />
      </div>
      
      <TodoList key={refreshKey} />
    </main>
  );
}
