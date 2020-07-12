module.exports = {
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['dist/', 'node_modules/'],
  plugins: ['@typescript-eslint', 'jest', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:jest/recommended',
    'eslint:recommended',
  ],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'never',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
};
