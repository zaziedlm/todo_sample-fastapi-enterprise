'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ホームページにアクセスした場合は自動的にダッシュボードにリダイレクト
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">家計簿アプリ</h1>
        <p className="text-gray-600">ダッシュボードに移動中...</p>
      </div>
    </div>
  );
}
