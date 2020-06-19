import { ControllerInterface, Request, Response } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';

@Injectable()
export class SignInController implements ControllerInterface {
    async handle(req: Request, res: Response): Promise<void> {
        console.log('in');

        return res.render('user/sign-in');
    }
}
