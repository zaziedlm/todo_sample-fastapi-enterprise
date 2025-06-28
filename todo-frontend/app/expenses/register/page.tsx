'use client';

import { useState } from 'react';
import ExpenseForm from '../../components/ExpenseForm';
import Link from 'next/link';

export default function ExpenseRegisterPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">支出登録</h1>
          <div className="flex gap-2">
            <Link
              href="/expenses/dashboard"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              ダッシュボード
            </Link>
            <Link
              href="/expenses/report"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              支出一覧
            </Link>
          </div>
        </div>

        <ExpenseForm onExpenseCreated={handleExpenseCreated} />

        {refreshKey > 0 && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            支出が正常に登録されました！
          </div>
        )}
      </div>
    </div>
  );
}
