import { Container } from '../component/container.component';

export const Config = (): ClassDecorator => {
    return (target): void => {
        Container.register(target, 'config');
    };
};
