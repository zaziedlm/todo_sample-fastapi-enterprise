// API関連の型定義

// APIエラーレスポンスの型定義
export interface ApiErrorResponse {
  detail: string | ValidationError[];
  status_code?: number;
}

// APIエラーの型定義（インターフェース）
export interface ApiError {
  message: string;
  statusCode: number;
  details: string | ValidationError[];
}

// バリデーションエラーの詳細型
export interface ValidationError {
  msg: string;
  type: string;
  loc?: string[];
}

// API操作の結果型
export type ApiResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: ApiError;
};

// APIレスポンスのラッパー型
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// HTTPステータスコードの型定義
export type HttpStatusCode = 
  | 200 // OK
  | 201 // Created
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 422 // Unprocessable Entity
  | 500; // Internal Server Error

// エラーメッセージを人間が読みやすい形に変換するヘルパー関数
export const getReadableErrorMessage = (error: ApiError): string => {
  if (typeof error.details === 'string') {
    return error.details;
  }
  
  if (Array.isArray(error.details)) {
    return error.details.map(detail => detail.msg).join(', ');
  }
  
  return error.message;
};
