/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#821528',
					light: '#a13346'
				},
				secondary: '#687998',
				accent: '#404dbf',
				neutral: '#8fbc94'
			}
		}
	},
	plugins: []
};
