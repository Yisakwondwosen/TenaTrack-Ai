module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios|@?react)'
  ],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
