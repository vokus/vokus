import { Request, Response } from '@vokus/http';
import { RouteDecorator } from '@vokus/dependency-injection';

@RouteDecorator({
    name: '/vokus/example',
    methods: ['get'],
    path: '/vokus/example',
})
export class IndexRoute {
    async handle(req: Request, res: Response): Promise<void> {
        return res.render('vokus/example/index');
    }
}
