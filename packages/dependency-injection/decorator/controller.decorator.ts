import { ContainerComponent } from '../component/container.component';

export const ControllerDecorator = (): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, 'controller');
    };
};
