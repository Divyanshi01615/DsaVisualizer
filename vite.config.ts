import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export Vite configuration
export default defineConfig({
  plugins: [react()],
  base:"/DsaVisualizer",
});
