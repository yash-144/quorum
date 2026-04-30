import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds — warm dark grays
        bg:       '#16161a',
        surface:  '#1e1e24',
        card:     '#1e1e24',
        panel:    '#242430',
        // Borders — subtle, not harsh
        border:   '#2e2e3a',
        'border-focus': '#5c6bc0',
        // Text
        primary:  '#e2e2ea',    // off-white, not pure white
        secondary:'#8888a0',    // muted lavender-gray
        muted:    '#4a4a60',
        // Accent — desaturated indigo, soft
        accent:   '#5c6bc0',
        'accent-light': '#818cf8',
        // Status
        passed:   '#4caf7d',
        failed:   '#e05c5c',
        pending:  '#c9a84c',
        active:   '#5c6bc0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        none: '0px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.4)',
        DEFAULT: '0 2px 8px rgba(0,0,0,0.35)',
        lg: '0 4px 16px rgba(0,0,0,0.4)',
        inner: 'inset 0 1px 3px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
