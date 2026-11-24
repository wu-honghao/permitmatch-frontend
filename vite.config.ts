import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],

    // Exclude Playwright E2E tests
    exclude: [
      ...configDefaults.exclude,
      "e2e/**",
    ],

    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/types/**",
        "src/main.tsx",
        "**/*.d.ts",
      ],
      reporter: ["text", "html"],
    },
  },
})