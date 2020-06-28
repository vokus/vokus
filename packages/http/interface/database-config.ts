export interface DatabaseConfigInterface {
    entities?: any[];
    database: string;
    username?: string;
    password?: string;
    host?: string;
    type: 'mysql' | 'sqlite';
}
