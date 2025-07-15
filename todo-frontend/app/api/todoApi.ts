import axios from 'axios';
import { 
  Todo, 
  TodoCreate, 
  TodoUpdate, 
  ApiError, 
  ApiResult,
  getReadableErrorMessage
} from '../types';

const API_URL = 'http://localhost:8000';

// APIクライアントの作成
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// エラーハンドリング用のヘルパー関数
const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.detail || error.message;
    const statusCode = error.response?.status || 500;
    const details = error.response?.data?.detail || error.message;
    return {
      message,
      statusCode,
      details
    };
  }
  return {
    message: error.message || 'Unknown error occurred',
    statusCode: 500,
    details: 'Unknown error occurred'
  };
};

// 基本的なAPI関数（既存）
export const getAllTodos = async (): Promise<Todo[]> => {
  const response = await apiClient.get('/todos/');
  return response.data;
};

export const getTodoById = async (id: number): Promise<Todo> => {
  const response = await apiClient.get(`/todos/${id}`);
  return response.data;
};

export const createTodo = async (todo: TodoCreate): Promise<Todo> => {
  const response = await apiClient.post('/todos/', todo);
  return response.data;
};

export const updateTodo = async (id: number, todo: TodoUpdate): Promise<Todo> => {
  const response = await apiClient.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await apiClient.delete(`/todos/${id}`);
  return response.data;
};

// セーフ版API関数（エラーハンドリング付き）
export const getAllTodosSafe = async (): Promise<ApiResult<Todo[]>> => {
  try {
    const todos = await getAllTodos();
    return { success: true, data: todos };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

export const getTodoByIdSafe = async (id: number): Promise<ApiResult<Todo>> => {
  try {
    const todo = await getTodoById(id);
    return { success: true, data: todo };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

export const createTodoSafe = async (todo: TodoCreate): Promise<ApiResult<Todo>> => {
  try {
    const newTodo = await createTodo(todo);
    return { success: true, data: newTodo };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

export const updateTodoSafe = async (id: number, todo: TodoUpdate): Promise<ApiResult<Todo>> => {
  try {
    const updatedTodo = await updateTodo(id, todo);
    return { success: true, data: updatedTodo };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

export const deleteTodoSafe = async (id: number): Promise<ApiResult<Todo>> => {
  try {
    const deletedTodo = await deleteTodo(id);
    return { success: true, data: deletedTodo };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};