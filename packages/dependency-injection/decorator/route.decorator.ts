import { Container } from '../component/container.component';

export const Route = (options?: {
    name: string;
    methods: string[];
    path: string;
    roles?: string[];
}): ClassDecorator => {
    return (target): void => {
        Container.register(target, 'route', options);
    };
};
