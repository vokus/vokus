import { EntityRepository, Repository } from 'typeorm';
import { Log } from '../entity/log';

@EntityRepository(Log)
export class LogRepository extends Repository<Log> {}
