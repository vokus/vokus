import { ControllerInterface, Injectable, Request, Response } from '@vokus/core';

@Injectable()
export class AppExampleHomeController implements ControllerInterface {
    async handle(req: Request, res: Response): Promise<void> {
        return res.render('example');
    }
}
