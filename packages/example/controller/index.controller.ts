import { Request, Response } from '@vokus/http';
import { ControllerDecorator } from '@vokus/dependency-injection';

@ControllerDecorator({
    name: '/typecast/user/sign-in',
    methods: ['get', 'post'],
    path: '/typecast/user/sign-in',
})
export class IndexController {
    async handle(req: Request, res: Response): Promise<void> {
        return res.render('vokus/example/index');
    }
}
