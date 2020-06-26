import { ControllerInterface, Request, Response } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';

@Injectable()
export class VokusUserSignInController implements ControllerInterface {
    async handle(req: Request, res: Response): Promise<void> {
        return res.render('vokus/user/sign-in');
    }
}
