// ToDoアイテムの型定義
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

// 新しいToDoを作成する際のリクエスト型
export interface TodoCreate {
  title: string;
  description?: string;
}

// ToDoを更新する際のリクエスト型
export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

// 経費カテゴリーの型定義
export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

// 新しいカテゴリーを作成する際のリクエスト型
export interface CategoryCreate {
  name: string;
  description?: string;
  color?: string;
}

// 経費の型定義
export interface Expense {
  id: number;
  amount: string;
  category_id: number;
  date: string;
  memo?: string;
  created_at: string;
  updated_at: string;
}

// 新しい経費を作成する際のリクエスト型
export interface ExpenseCreate {
  amount: string;
  category_id: number;
  date: string;
  memo?: string;
}

// 経費を更新する際のリクエスト型
export interface ExpenseUpdate {
  amount?: string;
  category_id?: number;
  date?: string;
  memo?: string;
}

// 経費サマリーの型定義
export interface ExpenseSummary {
  category_name: string;
  category_id: number;
  total_amount: string;
  color?: string;
}

// 月次経費の型定義
export interface MonthlyExpense {
  year: number;
  month: number;
  total_amount: string;
}

// ダッシュボードデータの型定義
export interface DashboardData {
  monthly_total: string;
  category_summary: ExpenseSummary[];
  monthly_trend: MonthlyExpense[];
}