export default interface EnvironmentVariableInterface {
    name: string;
    example: string | number | boolean;
    required?: boolean;
    allowedValues?: string[] | number[];
}
