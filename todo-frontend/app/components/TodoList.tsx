'use client';

import { Todo } from '../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function TodoList({ todos, loading, onUpdate, onDelete }: TodoListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="loading-spinner h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-md">
        <p className="text-slate-500 dark:text-slate-400">ToDo項目はありません。新しいタスクを追加してください。</p>
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
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}