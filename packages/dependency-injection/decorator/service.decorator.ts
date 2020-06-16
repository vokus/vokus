import { ContainerComponent } from '../component/container.component';

export const ServiceDecorator = (): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, 'service');
    };
};
