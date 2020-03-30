import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public code: number;

    @Column()
    public date: Date;

    @Column({ type: 'text' })
    public message: string;

    @Column({ type: 'varchar' })
    public contextType: string | undefined;

    @Column({ type: 'varchar' })
    public contextName: string | undefined;

    constructor(
        code: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
        date: Date,
        contextType: string | undefined,
        contextName: string | undefined,
        message: string,
    ) {
        this.code = code;
        this.date = date;
        this.contextType = contextType;
        this.contextName = contextName;
        this.message = message;
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
        }

        return 'debug';
    }
}
