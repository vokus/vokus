import { EnvironmentComponent } from '../component/environment.component';
import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

export const EnvironmentVariableDecorator = (environmentVariable: EnvironmentVariableInterface) => {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return (target: any, propertyKey: string): void => {
        EnvironmentComponent.registerEnvironmentVariable(environmentVariable);
        target[propertyKey] = EnvironmentComponent.getValueFromEnvironmentVariable(environmentVariable);
    };
};
