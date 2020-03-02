export interface EnvironmentVariableInterface {
    name: string;
    example: string | number | boolean;
    allowedValues?: string[] | number[];
    required?: boolean;
}
