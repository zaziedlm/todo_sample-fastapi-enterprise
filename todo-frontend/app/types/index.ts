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

// 家計簿エントリの型定義
export enum EntryType {
  INCOME = "income",
  EXPENSE = "expense"
}

export enum Category {
  FOOD = "food",
  TRANSPORT = "transport",
  HOUSING = "housing",
  UTILITIES = "utilities",
  ENTERTAINMENT = "entertainment",
  HEALTHCARE = "healthcare",
  EDUCATION = "education",
  SHOPPING = "shopping",
  SALARY = "salary",
  BONUS = "bonus",
  OTHER = "other"
}

export interface ExpenseEntry {
  id: number;
  date: string;
  entry_type: EntryType;
  category: Category;
  amount: number;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface ExpenseEntryCreate {
  date: string;
  entry_type: EntryType;
  category: Category;
  amount: number;
  description?: string;
}

export interface ExpenseEntryUpdate {
  date?: string;
  entry_type?: EntryType;
  category?: Category;
  amount?: number;
  description?: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  total_income: number;
  total_expense: number;
  balance: number;
  entries: ExpenseEntry[];
}