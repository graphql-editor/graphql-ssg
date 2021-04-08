/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  clearMocks: true,
  coverageProvider: 'v8',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}', '!**/*.spec.{ts,js}'],
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '@/(.*)': ['<rootDir>/src/$1'],
  },
  testMatch: ['**/__tests__/**/*.spec.(ts|tsx)'],
  watchPathIgnorePatterns: ['node_modules'],
  watchman: false,
};
