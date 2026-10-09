// ============================================================================
// Tailwind CSS Configuration - SIMMAS
// ============================================================================
// 
// FUNGSI:
// - Konfigurasi utility-first CSS framework (Tailwind)
// - Custom colors, animations, dan styling untuk aplikasi
// 
// CARA MENGUBAH:
// - Tambah warna baru:
//   colors: { brand: '#ff0000', success: '#00ff00' }
// 
// - Tambah animation baru:
//   1. Buat keyframes di theme.extend.keyframes
//   2. Tambah animation di theme.extend.animation
//   3. Gunakan: className="animate-[nama-animation]"
// 
// - Tambah breakpoint baru:
//   screens: { '3xl': '1920px' }
// 
// - Install plugin:
//   plugins: [require('@tailwindcss/forms')]
// 
// Dokumentasi: https://tailwindcss.com/docs/configuration
// ============================================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content files - Tailwind akan scan file-file ini untuk class names
  // Pastikan semua file component masuk list ini
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Dark mode configuration
  // 'class' = toggle dark mode dengan class di <html>
  // 'media' = otomatis ikut system preference
  darkMode: 'class',
  
  theme: {
    extend: {
      // ========================================
      // CUSTOM COLORS
      // ========================================
      // Colors menggunakan CSS variables dari globals.css
      // Untuk ubah warna, edit di src/app/globals.css
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        border: 'hsl(var(--border))',
      },
      
      // ========================================
      // CUSTOM ANIMATIONS
      // ========================================
      keyframes: {
        // Slide up from bottom (untuk modals)
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        
        // Slide down from top (untuk notifications)
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        
        // Simple fade in
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        
        // Pulsing effect (untuk loading states)
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        
        // Spinning effect (untuk loading spinners)
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        }
      },
      
      // Map keyframes to animation classes
      // Usage: className="animate-slideUp"
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  
  // Plugins untuk extend Tailwind functionality
  // Contoh: @tailwindcss/forms, @tailwindcss/typography
  plugins: [],
};
