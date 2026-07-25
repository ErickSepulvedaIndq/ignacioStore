import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    rules: {
      'no-unused-vars': 'error',
      'react/prop-types': 'off',
    },
  },
])