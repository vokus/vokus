import { EnvironmentComponent } from '../component/environment.component';
import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

export function EnvironmentVariableDecorator(environmentVariable: EnvironmentVariableInterface): any {
    return (target: any, propertyKey: any) => {
        target[propertyKey] = EnvironmentComponent.getValue(environmentVariable);
    };
}
