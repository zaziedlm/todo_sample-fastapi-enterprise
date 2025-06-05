'use client';

import { useState } from 'react';
import { Todo, TodoUpdate } from '../types';
import { updateTodo, deleteTodo } from '../api/todoApi';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [completed, setCompleted] = useState(todo.completed);

  const handleUpdate = async () => {
    const updatedTodo: TodoUpdate = {
      title,
      description: description || undefined,
      completed,
    };

    try {
      await updateTodo(todo.id, updatedTodo);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleCompleted = async () => {
    try {
      await updateTodo(todo.id, { completed: !completed });
      setCompleted(!completed);
      onUpdate();
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              説明
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={completed}
                onChange={toggleCompleted}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <h3
                className={`ml-2 text-lg font-medium ${
                  completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                削除
              </button>
            </div>
          </div>          {todo.description && (
            <p className={`text-gray-600 ${completed ? 'line-through' : ''}`}>{todo.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">作成日時: {new Date(todo.created_at).toLocaleString('ja-JP')}</p>
        </div>
      )}
    </div>
  );
}