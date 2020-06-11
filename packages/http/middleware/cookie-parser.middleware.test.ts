import { ContainerComponent } from '@vokus/dependency-injection';
import { CookieParserMiddleware } from './cookie-parser.middleware';

test('cookie-parser-middleware', async () => {
    const cookieParserMiddleware: CookieParserMiddleware = await ContainerComponent.create(CookieParserMiddleware);

    expect(cookieParserMiddleware.key).toBe('http/cookie-parser');
    expect(typeof cookieParserMiddleware.function).toBe('function');
});
