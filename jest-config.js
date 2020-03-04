module.exports = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: [
        //'<rootDir>/packages/**/*.ts'
        '<rootDir>/packages/dev/**/*.ts',
        '<rootDir>/packages/environment/**/*.ts',
        '<rootDir>/packages/file-system/**/*.ts',
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
        '<rootDir>/packages/dev',
        '<rootDir>/packages/environment',
        '<rootDir>/packages/file-system',
    ],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
