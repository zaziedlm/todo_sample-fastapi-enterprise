'use client';

import { useState } from 'react';
import ExpenseList from '../../components/ExpenseList';
import Link from 'next/link';

export default function ExpenseReportPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">支出一覧</h1>
          <div className="flex gap-2">
            <Link
              href="/expenses/dashboard"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              ダッシュボード
            </Link>
            <Link
              href="/expenses/register"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              支出登録
            </Link>
          </div>
        </div>

        <ExpenseList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
