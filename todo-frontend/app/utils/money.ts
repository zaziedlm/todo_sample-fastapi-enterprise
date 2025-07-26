/**
 * 金銭計算・表示用ユーティリティ関数
 * Decimal文字列として受け取る金額データを安全に処理します
 */

/**
 * 文字列の金額をフォーマットして表示
 * @param amount - Decimal文字列 (例: "1234.56")
 * @param currency - 通貨記号 (デフォルト: "¥")
 * @returns フォーマットされた文字列 (例: "¥1,234")
 */
export function formatMoney(amount: string, currency: string = "¥"): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return `${currency}0`;
  
  return `${currency}${Math.floor(num).toLocaleString()}`;
}

/**
 * 入力値を有効な金額文字列に変換（円単位・整数）
 * @param input - ユーザー入力値 (string | number)
 * @returns 有効な金額文字列（整数として、バックエンド用に.00付き）
 */
export function normalizeAmountInput(input: string | number): string {
  if (typeof input === 'number') {
    return Math.floor(Math.abs(input)).toFixed(2);
  }
  
  const num = parseInt(input.replace(/[^\d]/g, ''), 10);
  if (isNaN(num)) return "0.00";
  
  return num.toFixed(2);
}

/**
 * 金額文字列の配列を合計
 * @param amounts - 金額文字列の配列
 * @returns 合計の文字列
 */
export function sumAmounts(amounts: string[]): string {
  const total = amounts.reduce((sum, amount) => {
    const num = parseFloat(amount);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  
  return total.toFixed(2);
}

/**
 * 金額文字列を数値として比較
 * @param a - 金額文字列A
 * @param b - 金額文字列B
 * @returns 比較結果 (-1: a < b, 0: a = b, 1: a > b)
 */
export function compareAmounts(a: string, b: string): number {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  
  if (isNaN(numA) && isNaN(numB)) return 0;
  if (isNaN(numA)) return -1;
  if (isNaN(numB)) return 1;
  
  if (numA < numB) return -1;
  if (numA > numB) return 1;
  return 0;
}

/**
 * 入力フィールド用のamount値検証（円単位・整数）
 * @param value - 入力値
 * @returns 有効性とエラーメッセージ
 */
export function validateAmountInput(value: string): { isValid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { isValid: false, error: '金額を入力してください' };
  }
  
  const num = parseInt(value.replace(/[^\d]/g, ''), 10);
  if (isNaN(num)) {
    return { isValid: false, error: '有効な数値を入力してください' };
  }
  
  if (num < 0) {
    return { isValid: false, error: '金額は0以上で入力してください' };
  }
  
  if (num > 9999999) {
    return { isValid: false, error: '金額は9,999,999円以下で入力してください' };
  }
  
  return { isValid: true };
}

/**
 * 表示用の整数値を取得（入力フィールド用）
 * @param amount - Decimal文字列 (例: "1234.00")
 * @returns 整数値 (例: "1234")
 */
export function getDisplayAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0";
  return Math.floor(num).toString();
}