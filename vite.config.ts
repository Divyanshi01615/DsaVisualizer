import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determine deployment environment
const isGitHubPages = process.env.DEPLOY_ENV === 'GH_PAGES';

// Export Vite configuration
export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/DsaVisualizer/' : '/',
});
