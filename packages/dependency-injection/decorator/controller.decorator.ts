import { ContainerComponent } from '../component/container.component';

export const ControllerDecorator = (options?: {
    name: string;
    methods: string[];
    path: string;
    roles?: string[];
    backend?: {
        module?: {
            mainKey?: string;
            subKey?: string;
            titleKey?: string;
        };
    };
    disabled?: boolean;
}): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, options);
    };
};
