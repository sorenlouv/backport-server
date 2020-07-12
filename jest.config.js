module.exports = {
  preset: 'ts-jest',
  testRegex: '(test|src)/.*test.ts$',

  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
