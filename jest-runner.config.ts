import type { Config } from '@jest/types';
import defaultConfig from './jest.config';

const runnerConfig: Config.InitialOptions = {
    collectCoverageFrom: [],
    coverageThreshold: undefined,
    testTimeout: 6000000,
    detectOpenHandles: true,
};

export default { ...defaultConfig, ...runnerConfig };
