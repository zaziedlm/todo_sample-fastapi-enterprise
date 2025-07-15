'use client';

import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { useTodoState } from './hooks/useTodoState';
import { useEffect } from 'react';

export default function Home() {
  const todoState = useTodoState();

  // 初回読み込み時にTODOを取得
  useEffect(() => {
    todoState.fetchTodos();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">ToDo アプリケーション</h1>
        
        {/* 統計情報の表示 */}
        {todoState.todos.length > 0 && (
          <div className="flex justify-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
            <span>総数: {todoState.stats.total}</span>
            <span>完了: {todoState.stats.completed}</span>
            <span>未完了: {todoState.stats.pending}</span>
            <span>進捗: {todoState.stats.completionRate}%</span>
          </div>
        )}
      </div>
      
      {/* エラー表示 */}
      {todoState.error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-red-700 dark:text-red-400">{todoState.error}</p>
            <button
              onClick={todoState.clearError}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <TodoForm onAdd={() => todoState.refreshTodos()} />
      </div>
      
      <TodoList 
        todos={todoState.todos}
        loading={todoState.loading}
        onUpdate={() => todoState.refreshTodos()}
        onDelete={() => todoState.refreshTodos()}
      />
    </main>
  );
}
