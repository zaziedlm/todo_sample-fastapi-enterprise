import { Category, CategoryCreate, Expense, ExpenseCreate, ExpenseUpdate, DashboardData } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// カテゴリー関連API
export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  async createCategory(category: CategoryCreate): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  },

  async initDefaultCategories(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/init-defaults`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to initialize default categories');
    }
  },
};

// 経費関連API
export const expenseApi = {
  async getExpenses(year?: number, month?: number): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const response = await fetch(`${API_BASE_URL}/expenses/?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  },

  async createExpense(expense: ExpenseCreate): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return response.json();
  },

  async updateExpense(id: number, expense: ExpenseUpdate): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    if (!response.ok) {
      throw new Error('Failed to update expense');
    }
    return response.json();
  },

  async deleteExpense(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
  },

  async getDashboardData(year?: number, month?: number): Promise<DashboardData> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const response = await fetch(`${API_BASE_URL}/expenses/dashboard/data?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    return response.json();
  },
};
