// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Tailwind CSS 클래스를 사용하는 파일 경로
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}