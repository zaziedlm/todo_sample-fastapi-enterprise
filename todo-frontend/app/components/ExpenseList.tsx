'use client';

import { useState, useEffect } from 'react';
import { Expense, Category } from '../types';
import { expenseApi, categoryApi } from '../api/expenseApi';
import { formatMoney, sumAmounts } from '../utils/money';

interface ExpenseListProps {
  refreshTrigger?: number;
}

export default function ExpenseList({ refreshTrigger }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth, refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expensesData, categoriesData] = await Promise.all([
        expenseApi.getExpenses(selectedYear, selectedMonth),
        categoryApi.getCategories(),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || '未分類';
  };

  const getCategoryColor = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#C4C4C4';
  };

  const handleDelete = async (id: number) => {
    if (confirm('この支出を削除しますか？')) {
      try {
        await expenseApi.deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
        alert('支出を削除しました');
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('削除に失敗しました');
      }
    }
  };

  const totalAmount = sumAmounts(expenses.map(expense => expense.amount));

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">支出一覧</h2>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{month}月</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <div className="text-lg font-bold text-blue-800">
          {selectedYear}年{selectedMonth}月の合計: {formatMoney(totalAmount)}
        </div>
      </div>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">この月の支出はありません</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">日付</th>
                <th className="text-left py-2 px-3">カテゴリー</th>
                <th className="text-right py-2 px-3">金額</th>
                <th className="text-left py-2 px-3">メモ</th>
                <th className="text-center py-2 px-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">
                    {new Date(expense.date).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(expense.category_id) }}
                      ></div>
                      {getCategoryName(expense.category_id)}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right font-medium">
                    {formatMoney(expense.amount)}
                  </td>
                  <td className="py-2 px-3 max-w-xs">
                    <div className="truncate" title={expense.memo}>
                      {expense.memo || '-'}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
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
  );
}
