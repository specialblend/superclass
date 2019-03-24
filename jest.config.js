module.exports = {
    collectCoverageFrom: [
        '**/*.js',
        '**/*.jsx',
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    coveragePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/coverage/',
        '<rootDir>/jest.config.js',
        '<rootDir>/rollup.config.js',
    ],
    globalSetup: './__mocks__/environment.js',
    setupFilesAfterEnv: ['./__mocks__/support.js'],
    testEnvironment: 'node',
};
