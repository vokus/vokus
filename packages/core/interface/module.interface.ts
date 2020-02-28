export default interface ModuleInterface {
    start(): Promise<boolean>;
    stop(): Promise<boolean>;
}
