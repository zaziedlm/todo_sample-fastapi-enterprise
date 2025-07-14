/**
 * 標準的なナビゲーション関数
 * Turbopack本番運用向け - 実験的機能は使用しない
 */
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

// 標準的なナビゲーションフック
export function useAppRouter() {
  const router = useRouter();
  
  return {
    // 標準的なpush操作
    push: router.push,
    // 標準的なreplace操作
    replace: router.replace,
    // その他のルーター機能
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
  };
}

// 標準的なLink コンポーネントのラッパー
export function AppLink({ 
  href, 
  children, 
  ...props 
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
