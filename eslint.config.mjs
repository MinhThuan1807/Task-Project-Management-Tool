import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts'
    ]
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',

        // Browser globals (for Next.js)
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',

        // React globals
        React: 'readonly',
        JSX: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,

      // TypeScript ESLint recommended rules
      ...tseslint.configs.recommended.rules,

      // Common
      'no-console': 1,
      'no-extra-boolean-cast': 0,
      'no-lonely-if': 1,
      'no-trailing-spaces': 1,
      'no-multi-spaces': 1,
      'no-multiple-empty-lines': 1,
      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': [1, 'always'],
      'linebreak-style': 0,
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': 1,
      'comma-dangle': 1,
      'comma-spacing': 1,
      'arrow-spacing': 1,
      'array-bracket-spacing': 1,
      'indent': ['warn', 2],
      'semi': [1, 'never'],
      'quotes': ['error', 'single'],

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ]
    }
  }
]

export default eslintConfig
