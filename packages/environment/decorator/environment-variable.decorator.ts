import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';
import { EnvironmentComponent } from '../component/environment.component';

export const EnvironmentVariableDecorator = (environmentVariable: EnvironmentVariableInterface) => {
    return (target: any, propertyKey: string): void => {
        EnvironmentComponent.registerEnvironmentVariable(environmentVariable);
        target[propertyKey] = EnvironmentComponent.getValueFromEnvironmentVariable(environmentVariable);
    };
};
