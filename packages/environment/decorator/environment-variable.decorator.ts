import { EnvironmentComponent } from '../component/environment.component';
import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

export const EnvironmentVariable = (environmentVariable: EnvironmentVariableInterface) => {
    return (target: any, propertyKey: string): void => {
        EnvironmentComponent.registerEnvironmentVariable(environmentVariable);
        target[propertyKey] = EnvironmentComponent.getValueFromEnvironmentVariable(environmentVariable);
    };
};
