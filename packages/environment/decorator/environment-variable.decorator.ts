import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';
import { EnvironmentComponent } from '../component/environment.component';

export const EnvironmentVariableDecorator = (environmentVariable: EnvironmentVariableInterface): any => {
    return (target: any, propertyKey: any) => {
        target[propertyKey] = EnvironmentComponent.getValue(environmentVariable);
    };
};
