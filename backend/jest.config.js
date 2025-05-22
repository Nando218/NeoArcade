module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'routes/**/*.js',
    'middleware/**/*.js',
    'config/**/*.js',
    'server.js'
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {}
};