import { ContainerComponent } from '../component/container.component';

export const MiddlewareDecorator = (options?: { before?: string; after?: string }): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, options);
    };
};
