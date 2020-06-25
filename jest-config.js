module.exports = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/packages/**/*.ts', '!<rootDir>/packages/dev/**/*.ts', '!<rootDir>/**/index.ts'],
    coverageReporters: ['text'],
    coveragePathIgnorePatterns: ['node_modules', '!*.d.ts', '!*.js'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    errorOnDeprecated: true,
    roots: ['<rootDir>/packages'],
    testEnvironment: 'node',
    testTimeout: 30000,
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
