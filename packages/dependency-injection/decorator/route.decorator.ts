import { ContainerComponent } from '../component/container.component';

export const RouteDecorator = (options?: {
    name: string;
    methods: string[];
    path: string;
    roles?: string[];
}): ClassDecorator => {
    return (target): void => {
        ContainerComponent.register(target, 'route', options);
    };
};
