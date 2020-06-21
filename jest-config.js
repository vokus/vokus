module.exports = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/packages/**/*.ts',
        '!<rootDir>/packages/dev/**/*.ts'
    ],
    coverageReporters: ['text'],
    coveragePathIgnorePatterns: [
        'node_modules',
        '!*.d.ts',
        '!*.js',
        '<rootDir>/packages/example/index.ts',
        '<rootDir>/packages/example/index.js',
        '<rootDir>/packages/shields/index.ts',
        '<rootDir>/packages/shields/index.js'
    ],
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
        '<rootDir>/packages',
    ],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
