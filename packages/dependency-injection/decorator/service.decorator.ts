import { Container } from '../component/container.component';

export const Service = (): ClassDecorator => {
    return (target): void => {
        Container.register(target, 'service');
    };
};
