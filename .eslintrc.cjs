/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-refresh/only-export-components': 'warn',
  },
};
