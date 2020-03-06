module.exports = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: [
        //'<rootDir>/packages/**/*.ts'
        '<rootDir>/packages/environment/**/*.ts',
        '<rootDir>/packages/file-system/**/*.ts',
        '<rootDir>/packages/logger/**/*.ts',
        '<rootDir>/packages/string/**/*.ts',
    ],
    coverageReporters: ['text'],
    coveragePathIgnorePatterns: ['node_modules', '!*.d.ts', '!*.js', 'index.ts', 'index.js'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    errorOnDeprecated: true,
    roots: [
        // '<rootDir>/packages',
        '<rootDir>/packages/environment',
        '<rootDir>/packages/file-system',
        '<rootDir>/packages/logger',
        '<rootDir>/packages/string',
    ],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
