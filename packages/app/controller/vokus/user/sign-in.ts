import { ControllerInterface, Injectable, Request, Response } from '@vokus/core';

@Injectable()
export class VokusUserSignInController implements ControllerInterface {
    async handle(req: Request, res: Response): Promise<void> {
        return res.render('vokus/user/sign-in');
    }
}
