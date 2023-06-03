/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./layouts/**.{js,ts,jsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},

			colors: {
				white1: "#F5F5F5",
				white2: "#FAFAFA",
				gray1: "#737373",
			},
			fontFamily: {
				sans: ["var(--font-inter)"],
				mono: ["var(--font-roboto-mono)"],
			},
		},
	},
	plugins: [],
};
