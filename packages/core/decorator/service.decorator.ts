import ApplicationUtil from '../util/application.util';

export default function ServiceDecorator(): ClassDecorator {
    return target => {
        ApplicationUtil.registerClass(target, 'service');
    };
}
