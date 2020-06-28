import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: number;

    @Column()
    date: Date;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'varchar' })
    contextType: string | undefined;

    @Column({ type: 'varchar' })
    contextKey: string | undefined;

    constructor(
        code: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
        date: Date,
        contextType: string | undefined,
        contextKey: string | undefined,
        message: string,
    ) {
        this.code = code;
        this.date = date;
        this.contextType = contextType;
        this.contextKey = contextKey;
        this.message = message;
    }

    get level(): string {
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
