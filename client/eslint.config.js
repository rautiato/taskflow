import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import playwright from 'eslint-plugin-playwright'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'playwright-report', 'test-results', 'blob-report']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['e2e/**/*.ts', 'playwright.config.ts'],
    extends: [playwright.configs['flat/recommended']],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Playwright fixtures call `use(...)`, which this rule mistakes for
      // React's `use` hook.
      'react-hooks/rules-of-hooks': 'off',
      // `flat/recommended` only warns on these, and warnings don't fail
      // `yarn lint`. Each one leads to flaky, hanging or always-passing tests,
      // so fail the build instead. `no-skipped-test` stays a warning: a skip
      // with a reason is sometimes deliberate.
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-force-option': 'error',
      'playwright/expect-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
    },
  },
])
