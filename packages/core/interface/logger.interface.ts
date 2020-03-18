export interface LoggerInterface {
    emergency(message: string): Promise<void>;
    alert(message: string): Promise<void>;
    critical(message: string): Promise<void>;
    error(message: string): Promise<void>;
    warning(message: string): Promise<void>;
    notice(message: string): Promise<void>;
    info(message: string): Promise<void>;
    debug(message: string): Promise<void>;
}
