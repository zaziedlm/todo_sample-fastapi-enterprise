import axios from 'axios';
import { Todo, TodoCreate, TodoUpdate } from '../types';

const API_URL = 'http://localhost:8000';

// APIクライアントの作成
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// すべてのToDoを取得
export const getAllTodos = async (): Promise<Todo[]> => {
  const response = await apiClient.get('/todos/');
  return response.data;
};

// 特定のToDoを取得
export const getTodoById = async (id: number): Promise<Todo> => {
  const response = await apiClient.get(`/todos/${id}`);
  return response.data;
};

// 新しいToDoを作成
export const createTodo = async (todo: TodoCreate): Promise<Todo> => {
  const response = await apiClient.post('/todos/', todo);
  return response.data;
};

// ToDoを更新
export const updateTodo = async (id: number, todo: TodoUpdate): Promise<Todo> => {
  const response = await apiClient.put(`/todos/${id}`, todo);
  return response.data;
};

// ToDoを削除
export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await apiClient.delete(`/todos/${id}`);
  return response.data;
};