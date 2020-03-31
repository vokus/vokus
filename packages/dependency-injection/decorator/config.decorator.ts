import { ContainerComponent } from '../component/container.component';

export const ConfigDecorator = (): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target);
    };
};
