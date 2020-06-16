import { ContainerComponent } from '../component/container.component';

export const Config = (): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, 'config');
    };
};
