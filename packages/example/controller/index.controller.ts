import { Request, Response } from '@vokus/http';
import { ControllerDecorator } from '@vokus/dependency-injection';

@ControllerDecorator({
    name: '/vokus/example',
    methods: ['get'],
    path: '/vokus/example',
})
export class IndexController {
    async handle(req: Request, res: Response): Promise<void> {
        return res.render('vokus/example/index');
    }
}
