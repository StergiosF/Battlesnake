export default {
  transform: {},
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!src/server.js'],
  coverageThreshold: {
    global: {
      statements: 50,
    },
  },
};
