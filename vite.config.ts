import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	// IMPORTANT: URL de base pour GitHub Pages sous /Freshkeeper_App/
	base: '/Freshkeeper_App/',
	plugins: [react()],
})
