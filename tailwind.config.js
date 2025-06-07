/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        // ポストが画面に現れるアニメーション
        'post-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        // ポストがターゲットに吸収されるアニメーション
        'post-absorb': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) scale(0.1)', opacity: '0' },
        },
      },
      animation: {
        'post-in': 'post-in 0.5s ease-out forwards', // 画面内に移動するアニメーション
        'post-absorb': 'post-absorb 1s ease-in-out forwards', // 吸収アニメーション
      },
    },
  },
  plugins: [],
}
