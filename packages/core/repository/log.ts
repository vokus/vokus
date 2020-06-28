import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '../decorator/injectable';
import { Log } from '../entity/log';

@Injectable()
@EntityRepository(Log)
export class LogRepository extends Repository<Log> {}
