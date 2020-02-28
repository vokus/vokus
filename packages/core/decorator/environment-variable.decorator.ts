import EnvironmentUtil from '../util/environment.util';

import EnvironmentVariableInterface from '../interface/environment-variable.interface';

export default function EnvironmentVariableDecorator(environmentVariable: EnvironmentVariableInterface) {
    return (target: any, propertyKey: any) => {
        target[propertyKey] = EnvironmentUtil.getValue(environmentVariable);
    };
}
