import { ContainerComponent } from '../component/container.component';

export const Middleware = (options?: { before?: string; after?: string }): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, 'middleware', options);
    };
};
