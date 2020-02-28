import ApplicationUtil from '../util/application.util';

export default function ControllerDecorator(): ClassDecorator {
    return target => {
        ApplicationUtil.registerClass(target, 'controller');
    };
}
