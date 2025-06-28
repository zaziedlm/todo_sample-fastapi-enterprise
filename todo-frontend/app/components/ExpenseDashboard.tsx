'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { DashboardData } from '../types';
import { expenseApi } from '../api/expenseApi';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ExpenseDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    loadDashboardData();
  }, [selectedYear, selectedMonth]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await expenseApi.getDashboardData(selectedYear, selectedMonth);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">データを読み込めませんでした</div>
      </div>
    );
  }

  // 円グラフのデータ
  const pieData = {
    labels: dashboardData.category_summary.map(item => item.category_name),
    datasets: [
      {
        data: dashboardData.category_summary.map(item => item.total_amount),
        backgroundColor: dashboardData.category_summary.map(item => item.color || '#C4C4C4'),
        borderWidth: 1,
      },
    ],
  };

  // 線グラフのデータ
  const lineData = {
    labels: dashboardData.monthly_trend.map(item => `${item.year}/${item.month}`),
    datasets: [
      {
        label: '月次支出',
        data: dashboardData.monthly_trend.map(item => item.total_amount),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ¥${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '月次支出推移',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '¥' + value.toLocaleString();
          }
        }
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">経費ダッシュボード</h1>
          <div className="flex gap-4">
            <Link
              href="/expenses/register"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              支出登録
            </Link>
            <Link
              href="/expenses/report"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              支出一覧
            </Link>
            <Link
              href="/"
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              Todo管理
            </Link>
          </div>
        </div>

        {/* 期間選択 */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex gap-4 items-center">
            <label className="font-medium">期間選択:</label>
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

        {/* 月次合計 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-2">月次支出合計</h2>
          <div className="text-3xl font-bold text-blue-600">
            ¥{dashboardData.monthly_total.toLocaleString()}
          </div>
          <div className="text-gray-500">
            {selectedYear}年{selectedMonth}月
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* カテゴリ別円グラフ */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">カテゴリ別支出</h2>
            {dashboardData.category_summary.length > 0 ? (
              <div className="h-80">
                <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                この月の支出データがありません
              </div>
            )}
          </div>

          {/* 月次推移グラフ */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">月次推移</h2>
            {dashboardData.monthly_trend.length > 0 ? (
              <div className="h-80">
                <Line data={lineData} options={lineOptions} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                推移データがありません
              </div>
            )}
          </div>
        </div>

        {/* カテゴリ別詳細 */}
        {dashboardData.category_summary.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">カテゴリ別詳細</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">カテゴリー</th>
                    <th className="text-right py-2 px-3">金額</th>
                    <th className="text-right py-2 px-3">割合</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.category_summary.map((item) => {
                    const percentage = (item.total_amount / dashboardData.monthly_total * 100).toFixed(1);
                    return (
                      <tr key={item.category_id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color || '#C4C4C4' }}
                            ></div>
                            {item.category_name}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right font-medium">
                          ¥{item.total_amount.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
