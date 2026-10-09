// ============================================================================
// Next.js Configuration - SIMMAS
// ============================================================================
// 
// FUNGSI:
// - Konfigurasi Next.js framework
// - Mengatur build settings dan optimizations
// 
// CARA MENGUBAH:
// - Tambah image domains: 
//   images: { domains: ['supabase.co', 'example.com'] }
// 
// - Disable strict mode (tidak disarankan):
//   reactStrictMode: false
// 
// - Tambah redirects:
//   async redirects() {
//     return [{ source: '/old', destination: '/new', permanent: true }]
//   }
// 
// - Tambah environment variables:
//   env: { CUSTOM_KEY: 'value' }
// 
// Dokumentasi: https://nextjs.org/docs/app/api-reference/next-config-js
// ============================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode - enable untuk catch bugs di development
  // Akan render components 2x untuk detect side effects
  reactStrictMode: true,
};

export default nextConfig;
