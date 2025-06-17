'use client';

import { useState, useEffect } from 'react';
import { ExpenseApi } from '../api/expenseApi';
import { ExpenseEntry, EntryType, Category } from '../types';
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

export default function Entries() {
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: ExpenseEntry[];
      
      if (startDate && endDate) {
        data = await ExpenseApi.getEntriesByDateRange(startDate, endDate);
      } else {
        data = await ExpenseApi.getEntries();
      }
      
      setEntries(data);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('この記録を削除しますか？')) {
      return;
    }

    try {
      await ExpenseApi.deleteEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      setError('削除に失敗しました');
      console.error('Error deleting entry:', err);
    }
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toLocaleString('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className="container mx-auto p-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">登録履歴</h1>
        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            ダッシュボードに戻る
          </Link>
          <Link
            href="/entry/new"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            新規登録
          </Link>
        </div>
      </div>

      {/* 期間フィルター */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">期間で絞り込み</h2>
        <div className="flex space-x-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={fetchEntries}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            検索
          </button>
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              fetchEntries();
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
          >
            クリア
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              登録された記録がありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日付
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      区分
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      備考
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.entry_type === EntryType.INCOME
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.entry_type === EntryType.INCOME ? '収入' : '支出'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categoryLabels[entry.category]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={entry.entry_type === EntryType.INCOME ? 'text-green-600' : 'text-red-600'}>
                          {entry.entry_type === EntryType.INCOME ? '+' : '-'}{formatAmount(Math.abs(entry.amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {entry.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 合計表示 */}
      {entries.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">期間合計</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">収入</div>
              <div className="text-lg font-bold text-green-600">
                {formatAmount(
                  entries
                    .filter(entry => entry.entry_type === EntryType.INCOME)
                    .reduce((sum, entry) => sum + entry.amount, 0)
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">支出</div>
              <div className="text-lg font-bold text-red-600">
                {formatAmount(
                  entries
                    .filter(entry => entry.entry_type === EntryType.EXPENSE)
                    .reduce((sum, entry) => sum + entry.amount, 0)
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">収支</div>
              <div className={`text-lg font-bold ${
                entries.reduce((sum, entry) => 
                  sum + (entry.entry_type === EntryType.INCOME ? entry.amount : -entry.amount), 0
                ) >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {formatAmount(
                  entries.reduce((sum, entry) => 
                    sum + (entry.entry_type === EntryType.INCOME ? entry.amount : -entry.amount), 0
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}