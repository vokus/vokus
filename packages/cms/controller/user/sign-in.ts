import { Request, Response } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';

@Injectable()
export class SignInController {
    async handle(req: Request, res: Response): Promise<void> {
        return res.render('user/sign-in');
    }
}
