import { Injectable } from '../../cms/node_modules/@vokus/dependency-injection';

@Injectable()
export class Template {
    async start() {
        for (const path of this.applicationConfig.paths) {
            const viewPath = nodePath.join(path, 'view/template');

            if (await FileSystemUtil.isDirectory(viewPath)) {
                await this.compileTemplates(viewPath);
            }
        }
    }

    async addTemplateConfiguration(templateConfiguration: TemplateConfigurationInterface) {}

    async render(
        filePath: string,
        locals: { [key: string]: any },
        callback: (val: any, renderedHTML?: any) => void,
    ): Promise<void> {
        if ('function' !== typeof this.templates[filePath]) {
            throw new Error(`template ${filePath} does not exists`);
        }

        if ('string' !== typeof locals.locale || 0 === locals.locale.length) {
            locals.locale = null;
        }

        locals.view = {};

        for (const viewHelper of Object.values(await Container.getViewHelpers())) {
            let viewHelperName = viewHelper.constructor.name.replace('ViewHelper', '');
            viewHelperName = viewHelperName.charAt(0).toLowerCase() + viewHelperName.slice(1);

            locals.view[viewHelperName] = viewHelper.render.bind(viewHelper);
        }

        try {
            return callback(null, this.templates[filePath](locals, { cache: true }));
        } catch (err) {
            return callback(err);
        }
    }

    private async compileTemplates(path: string) {
        if (await FileSystemUtil.isDirectory(path)) {
            for (const fileName of await FileSystemUtil.readDirectory(path)) {
                await this.compileTemplates(nodePath.join(path, fileName));
            }
        } else if (await FileSystemUtil.isFile(path)) {
            this.templates[path] = pug.compileFile(path, {
                filename: path,
            });
        }
    }
}
