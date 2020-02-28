export interface IEnvironmentVariable {
    name: string;
    example: string | number | boolean;
    required?: boolean;
    allowedValues?: string[] | number[];
}