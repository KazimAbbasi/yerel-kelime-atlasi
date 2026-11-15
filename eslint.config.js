import globals from 'globals'
import hooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist/**', '.pnpm-store/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': hooks },
    rules: {
      ...hooks.configs.recommended.rules,
      'no-undef': 'error',
    },
  },
]
