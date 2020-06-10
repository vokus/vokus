import { ContainerComponent } from '../component/container.component';

export const MiddlewareDecorator = (): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target);
    };
};
