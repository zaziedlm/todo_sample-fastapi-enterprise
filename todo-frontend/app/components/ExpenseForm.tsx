'use client';

import { useState, useEffect } from 'react';
import { Category, ExpenseCreate } from '../types';
import { categoryApi, expenseApi } from '../api/expenseApi';
import { normalizeAmountInput, validateAmountInput, getDisplayAmount } from '../utils/money';

interface ExpenseFormProps {
  onExpenseCreated: () => void;
}

export default function ExpenseForm({ onExpenseCreated }: ExpenseFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ExpenseCreate>({
    amount: '0.00',
    category_id: 0,
    date: new Date().toISOString().split('T')[0],
    memo: '',
  });
  const [displayAmount, setDisplayAmount] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryApi.getCategories();
      if (categoriesData.length === 0) {
        await categoryApi.initDefaultCategories();
        const newCategories = await categoryApi.getCategories();
        setCategories(newCategories);
      } else {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 金額バリデーション
    const amountValidation = validateAmountInput(displayAmount);
    if (!amountValidation.isValid) {
      alert(amountValidation.error);
      return;
    }
    
    if (formData.category_id === 0) {
      alert('カテゴリーを選択してください');
      return;
    }

    setLoading(true);
    try {
      // displayAmountから正規化したamountを作成してAPIに送信
      const submitData = {
        ...formData,
        amount: normalizeAmountInput(displayAmount)
      };
      
      await expenseApi.createExpense(submitData);
      setFormData({
        amount: '0.00',
        category_id: 0,
        date: new Date().toISOString().split('T')[0],
        memo: '',
      });
      setDisplayAmount('0');
      onExpenseCreated();
      alert('支出を登録しました');
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('支出の登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">支出登録</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            金額 *
          </label>
          <input
            type="number"
            id="amount"
            value={displayAmount}
            onChange={(e) => setDisplayAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1000"
            required
            min="0"
            step="1"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリー *
          </label>
          <select
            id="category"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value={0}>カテゴリーを選択</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            日付 *
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
            メモ
          </label>
          <textarea
            id="memo"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="メモを入力（任意）"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '登録中...' : '支出を登録'}
        </button>
      </form>
    </div>
  );
}
