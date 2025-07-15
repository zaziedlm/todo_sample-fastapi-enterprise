import { useState, useCallback, useMemo } from 'react';
import { Todo, TodoCreate, TodoUpdate } from '../types';
import { 
  getAllTodosSafe, 
  createTodoSafe, 
  updateTodoSafe, 
  deleteTodoSafe 
} from '../api/todoApi';

// TODO状態の型定義
export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

// TODO操作の型定義
export interface TodoActions {
  fetchTodos: () => Promise<void>;
  addTodo: (todo: TodoCreate) => Promise<boolean>;
  updateTodo: (id: number, todo: TodoUpdate) => Promise<boolean>;
  deleteTodo: (id: number) => Promise<boolean>;
  clearError: () => void;
  refreshTodos: () => Promise<void>;
}

// TODOの状態管理フック
export function useTodoState() {
  const [state, setState] = useState<TodoState>({
    todos: [],
    loading: false,
    error: null,
    lastFetched: null,
  });

  // エラーをクリア
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // TODOを取得
  const fetchTodos = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await getAllTodosSafe();
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        todos: result.data,
        loading: false,
        lastFetched: new Date(),
      }));
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: result.error.getReadableMessage(),
      }));
    }
  }, []);

  // TODOを追加
  const addTodo = useCallback(async (todo: TodoCreate): Promise<boolean> => {
    setState(prev => ({ ...prev, error: null }));
    
    const result = await createTodoSafe(todo);
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        todos: [...prev.todos, result.data],
      }));
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: result.error.getReadableMessage(),
      }));
      return false;
    }
  }, []);

  // TODOを更新
  const updateTodo = useCallback(async (id: number, todo: TodoUpdate): Promise<boolean> => {
    setState(prev => ({ ...prev, error: null }));
    
    const result = await updateTodoSafe(id, todo);
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        todos: prev.todos.map(t => t.id === id ? result.data : t),
      }));
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: result.error.getReadableMessage(),
      }));
      return false;
    }
  }, []);

  // TODOを削除
  const deleteTodo = useCallback(async (id: number): Promise<boolean> => {
    setState(prev => ({ ...prev, error: null }));
    
    const result = await deleteTodoSafe(id);
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        todos: prev.todos.filter(t => t.id !== id),
      }));
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: result.error.getReadableMessage(),
      }));
      return false;
    }
  }, []);

  // TODOを再取得（キャッシュを無視）
  const refreshTodos = useCallback(async () => {
    await fetchTodos();
  }, [fetchTodos]);

  // 統計情報の計算（メモ化）
  const stats = useMemo(() => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [state.todos]);

  return {
    // 状態
    ...state,
    
    // アクション
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    clearError,
    refreshTodos,
    
    // 計算された値
    stats,
  };
}

// TODO統計情報のみを取得するフック
export function useTodoStats(todos: Todo[]) {
  return useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [todos]);
}
