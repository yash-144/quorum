import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
      },
      colors: {
        bg: '#080808',
        surface: '#0f0f0f',
        card: '#141414',
        border: '#1e1e1e',
        'border-hover': '#2a2a2a',
        active: '#3b82f6',
        passed: '#22c55e',
        failed: '#ef4444',
        pending: '#f59e0b',
        accent: '#6366f1',
        primary: '#f0f0f0',
        secondary: '#888888',
        muted: '#3a3a3a',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
