import { Environment } from '../component/environment';
import { EnvironmentVariableInterface } from '../interface/environment-variable';

export const EnvironmentVariable = (environmentVariable: EnvironmentVariableInterface) => {
    return (target: any, propertyKey: string): void => {
        Environment.registerEnvironmentVariable(environmentVariable);
        target[propertyKey] = Environment.getValueFromEnvironmentVariable(environmentVariable);
    };
};
