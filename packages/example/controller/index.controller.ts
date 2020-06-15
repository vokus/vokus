export class IndexController {
    public async handle(req: Request, res: Response): Promise<void> {
        return res.render('typecast/index');
    }
}
}
