import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/packages/**/*.ts', '!<rootDir>/**/index.ts'],
    coverageReporters: ['text'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    moduleFileExtensions: ['js', 'ts'],
    testEnvironment: 'node',
    testTimeout: 30000,
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    roots: ['<rootDir>/packages'],
};

export default config;
