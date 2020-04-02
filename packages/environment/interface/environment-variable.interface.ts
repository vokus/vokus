export interface EnvironmentVariableInterface {
    name: string;
    example: string | number | boolean;
    required: boolean;
    allowedValues?: string[] | number[] | boolean[];
    default?: string | number | boolean;
}
