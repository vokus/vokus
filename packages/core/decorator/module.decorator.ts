import ApplicationUtil from "../util/application.util";

export default function ModuleDecorator(options?: { controllers?: any[]; services?: any[] }): ClassDecorator {
    return target => {
        ApplicationUtil.registerClass(target, 'module');
    };
}
