'use client';

import { useState, useEffect } from 'react';
import { ExpenseApi } from '../api/expenseApi';
import { MonthlySummary, EntryType, Category } from '../types';
import Link from 'next/link';

const categoryLabels: Record<Category, string> = {
  [Category.FOOD]: '食費',
  [Category.TRANSPORT]: '交通費',
  [Category.HOUSING]: '住居費',
  [Category.UTILITIES]: '光熱費',
  [Category.ENTERTAINMENT]: '娯楽費',
  [Category.HEALTHCARE]: '医療費',
  [Category.EDUCATION]: '教育費',
  [Category.SHOPPING]: '買い物',
  [Category.SALARY]: '給与',
  [Category.BONUS]: 'ボーナス',
  [Category.OTHER]: 'その他'
};

export default function Dashboard() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonthlySummary();
  }, [selectedYear, selectedMonth]);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ExpenseApi.getMonthlySummary(selectedYear, selectedMonth);
      setSummary(data);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error('Error fetching monthly summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toLocaleString('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    });
  };

  const getCategoryStats = () => {
    if (!summary) return [];
    
    const categoryMap = new Map<Category, number>();
    
    summary.entries.forEach(entry => {
      if (entry.entry_type === EntryType.EXPENSE) {
        const current = categoryMap.get(entry.category) || 0;
        categoryMap.set(entry.category, current + entry.amount);
      }
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  if (loading) {
    return <div className="p-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">家計簿ダッシュボード</h1>
        <div className="flex space-x-4">
          <Link
            href="/todos"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            ToDoアプリを開く
          </Link>
          <Link
            href="/entry/new"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            収支を登録
          </Link>
        </div>
      </div>

      {/* 月選択 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">表示期間</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">月</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}月</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 月次サマリー */}
      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-green-800 mb-2">収入</h3>
              <p className="text-2xl font-bold text-green-600">{formatAmount(summary.total_income)}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-red-800 mb-2">支出</h3>
              <p className="text-2xl font-bold text-red-600">{formatAmount(summary.total_expense)}</p>
            </div>
            <div className={`p-6 rounded-lg shadow-md ${summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                収支
              </h3>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatAmount(summary.balance)}
              </p>
            </div>
          </div>

          {/* カテゴリ別支出 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">カテゴリ別支出</h3>
            <div className="space-y-3">
              {getCategoryStats().map(({ category, amount }) => (
                <div key={category} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{categoryLabels[category]}</span>
                  <span className="text-red-600 font-semibold">{formatAmount(amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 最近の取引 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">最近の取引</h3>
              <Link
                href="/entries"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                すべて見る →
              </Link>
            </div>
            <div className="space-y-2">
              {summary.entries.slice(0, 5).map(entry => (
                <div key={entry.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">{categoryLabels[entry.category]}</span>
                    {entry.description && (
                      <span className="text-gray-600 ml-2">- {entry.description}</span>
                    )}
                    <div className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    entry.entry_type === EntryType.INCOME ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.entry_type === EntryType.INCOME ? '+' : '-'}{formatAmount(Math.abs(entry.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}