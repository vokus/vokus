import { Container } from '../component/container.component';

export const Middleware = (options?: { before?: string; after?: string }): ClassDecorator => {
    return (target): void => {
        Container.register(target, 'middleware', options);
    };
};
