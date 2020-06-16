import { ContainerComponent } from '../component/container.component';

export const Service = (): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, 'service');
    };
};
