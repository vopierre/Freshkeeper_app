import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	// IMPORTANT: URL de base pour GitHub Pages (nom du repo en minuscules)
	base: '/Freshkeeper_app/',
	plugins: [react()],
})
