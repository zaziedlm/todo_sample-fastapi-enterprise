'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseApi } from '../../api/expenseApi';
import { EntryType, Category, ExpenseEntryCreate } from '../../types';
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

export default function NewEntry() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ExpenseEntryCreate>({
    date: new Date().toISOString().split('T')[0],
    entry_type: EntryType.EXPENSE,
    category: Category.OTHER,
    amount: 0,
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      setError('金額は0より大きい値を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 円を整数（セント単位）に変換
      const entryData = {
        ...formData,
        amount: Math.round(formData.amount * 100)
      };
      
      await ExpenseApi.createEntry(entryData);
      router.push('/dashboard');
    } catch (err) {
      setError('登録に失敗しました');
      console.error('Error creating entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({ ...formData, amount: value });
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">収支登録</h1>
          <Link
            href="/dashboard"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ← ダッシュボードに戻る
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 日付 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 収支区分 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              収支区分
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value={EntryType.INCOME}
                  checked={formData.entry_type === EntryType.INCOME}
                  onChange={(e) => setFormData({ ...formData, entry_type: e.target.value as EntryType })}
                  className="mr-2"
                />
                <span className="text-green-600 font-medium">収入</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value={EntryType.EXPENSE}
                  checked={formData.entry_type === EntryType.EXPENSE}
                  onChange={(e) => setFormData({ ...formData, entry_type: e.target.value as EntryType })}
                  className="mr-2"
                />
                <span className="text-red-600 font-medium">支出</span>
              </label>
            </div>
          </div>

          {/* カテゴリ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 金額 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              金額（円）
            </label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={handleAmountChange}
              min="0"
              step="1"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              required
            />
          </div>

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              備考（任意）
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="詳細を入力..."
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
      </div>
    </div>
  );
}