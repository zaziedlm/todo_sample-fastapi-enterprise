import axios from 'axios';
import { ExpenseEntry, ExpenseEntryCreate, ExpenseEntryUpdate, MonthlySummary } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const expenseApi = axios.create({
  baseURL: `${API_BASE_URL}/expenses`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ExpenseApi = {
  // 全エントリ取得
  async getEntries(): Promise<ExpenseEntry[]> {
    const response = await expenseApi.get('/');
    return response.data;
  },

  // 日付範囲でエントリ取得
  async getEntriesByDateRange(startDate: string, endDate: string): Promise<ExpenseEntry[]> {
    const response = await expenseApi.get('/', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  // 単一エントリ取得
  async getEntry(id: number): Promise<ExpenseEntry> {
    const response = await expenseApi.get(`/${id}`);
    return response.data;
  },

  // 月別サマリー取得
  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const response = await expenseApi.get(`/summary/${year}/${month}`);
    return response.data;
  },

  // エントリ作成
  async createEntry(entry: ExpenseEntryCreate): Promise<ExpenseEntry> {
    const response = await expenseApi.post('/', entry);
    return response.data;
  },

  // エントリ更新
  async updateEntry(id: number, entry: ExpenseEntryUpdate): Promise<ExpenseEntry> {
    const response = await expenseApi.put(`/${id}`, entry);
    return response.data;
  },

  // エントリ削除
  async deleteEntry(id: number): Promise<ExpenseEntry> {
    const response = await expenseApi.delete(`/${id}`);
    return response.data;
  },
};