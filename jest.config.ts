import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    bail: true,
    collectCoverage: true,
    collectCoverageFrom: ['packages/**/*.ts', '!**/index.ts', '!packages/**/bin/**/*.ts'],
    coverageReporters: ['text'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    errorOnDeprecated: true,
    moduleFileExtensions: ['js', 'ts'],
    testEnvironment: 'node',
    testRegex: ['.*\\.test\\.ts$'],
    testTimeout: 30000,
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
};

export default config;
