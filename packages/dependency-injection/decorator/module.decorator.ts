import { ContainerComponent } from '../component/container.component';

export const ModuleDecorator = (options?: { controllers?: any[]; services?: any[] }): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, 'module');
    };
};
