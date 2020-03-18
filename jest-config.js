module.exports = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/packages/**/*.ts'
    ],
    coverageReporters: ['text'],
    coveragePathIgnorePatterns: ['node_modules', '!*.d.ts', '!*.js', 'index.ts', 'index.js'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
    errorOnDeprecated: true,
    roots: [
        '<rootDir>/packages',
    ],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
