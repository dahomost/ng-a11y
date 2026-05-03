/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/cypress/',
    '/e2e/',
    '/playwright/',
    '/test-results/',
    '/playwright-report/',
  ],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.routes.ts',
    '!src/main.ts',
    '!src/environments/**',
  ],
  coverageDirectory: 'coverage/jest',
  coverageReporters: ['text', 'lcov'],
};
