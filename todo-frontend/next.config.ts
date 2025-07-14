import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 本番環境でのパフォーマンス最適化
  poweredByHeader: false,
  compress: true,
  // React 19の新機能を活用
  reactStrictMode: true,
  
  // 本番ビルド向け設定
  // Turbopackは開発時のみ使用（ビルド時は従来のWebpack）
  output: 'standalone', // Dockerデプロイメント対応
  
  // 本番最適化
  generateEtags: false, // ETags無効化でパフォーマンス向上
};

export default nextConfig;
