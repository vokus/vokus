import { ObjectManager } from '../component/object-manager';

export const Injectable = (): ClassDecorator => {
    return (target): void => {
        ObjectManager.register(target);
    };
};
