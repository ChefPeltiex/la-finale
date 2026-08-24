import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.test.tsx'],
    setupFiles: ['src/tests/setup.ts'],
    /* Un échec de requête ne recrache pas tout le DOM dans la console. */
    env: { DEBUG_PRINT_LIMIT: '600' },
    reporters: 'dot',
  },
})
