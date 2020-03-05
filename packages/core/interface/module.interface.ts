export interface ModuleInterface {
    start(): Promise<boolean>;
    stop(): Promise<boolean>;
}
