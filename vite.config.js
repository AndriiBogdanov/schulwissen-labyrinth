import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Using base: './' makes the build work on GitHub Pages out of a subpath
// and also on Vercel (which serves from /). Switch to '/' if you deploy
// only to Vercel and want absolute asset URLs.
export default defineConfig({
  plugins: [react()],
  base: './'
})
