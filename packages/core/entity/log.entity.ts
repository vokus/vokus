import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class LogEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public code: number;

    @Column()
    public date: Date;

    @Column({ type: 'text' })
    public message: string;

    @Column({ type: 'varchar' })
    public contextType: string;

    @Column({ type: 'varchar' })
    public contextName: string;

    @Column({ type: 'text' })
    public data: string = '';

    constructor(code: number, date: Date, contextType: string, contextName: string, message: string, data: string) {
        this.code = code;
        this.date = date;
        this.contextType = contextType;
        this.contextName = contextName;
        this.message = message;
        this.data = data;
    }

    public get level(): string {
        switch (this.code) {
            case 0:
                return 'emergency';
            case 1:
                return 'alert';
            case 2:
                return 'critical';
            case 3:
                return 'error';
            case 4:
                return 'warning';
            case 5:
                return 'notice';
            case 6:
                return 'info';
            default:
                return 'debug';
        }
    }
}
