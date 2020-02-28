import ApplicationConfig from './application.config';
import ApplicationUtil from '../util/application.util';

test('application-config', async () => {
    const applicationConfig = await ApplicationUtil.create<ApplicationConfig>(
        ApplicationConfig,
    );

    expect(applicationConfig.cluster).toBe(true);
    expect(applicationConfig.context).toBe('test');
    expect(typeof applicationConfig.rootPath).toBe('string');
    expect(applicationConfig.rootPath.length).toBeGreaterThan(0);
    expect(applicationConfig.startDate.getTime() <= Date.now()).toBe(true);

    expect(applicationConfig.isAcceptance()).toBe(false);
    expect(applicationConfig.isDevelopment()).toBe(false);
    expect(applicationConfig.isProduction()).toBe(false);
    expect(applicationConfig.isStaging()).toBe(false);
    expect(applicationConfig.isTest()).toBe(true);
});
