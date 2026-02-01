/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dhex-bg': '#0a0a0f',
                'dhex-bg-secondary': '#13131a',
                'dhex-accent': '#8b5cf6', // Violet
                'dhex-accent-hover': '#7c3aed',
                'dhex-text': '#e2e8f0',
                'dhex-muted': '#94a3b8',
            },
            fontFamily: {
                sans: ['Geist', 'sans-serif'],
                mono: ['Geist Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
