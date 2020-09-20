module.exports = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/packages/**/*.ts',
        '!<rootDir>/packages/dev/**/*.ts',
        '!<rootDir>/**/index.ts',
        '!<rootDir>/packages/**/bin/**/*.ts',
    ],
    coverageReporters: ['text'],
    coveragePathIgnorePatterns: ['node_modules', '!*.d.ts', '!*.js'],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
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
