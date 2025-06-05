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