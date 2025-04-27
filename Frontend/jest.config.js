module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {}, // Add this line
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
  };
  