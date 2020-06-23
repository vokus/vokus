import * as nodePath from 'path';
import { FileSystem } from '@vokus/file-system';
import { Injectable } from '@vokus/dependency-injection';
import { ViewConfigInterface } from '../interface/view-config';
import pug from 'pug';

@Injectable()
export class View {
    protected _paths: string[] = [];
    protected _templates: { [key: string]: any } = {};
    protected _fileSystem: FileSystem;

    constructor(fileSystem: FileSystem) {
        this._fileSystem = fileSystem;
    }

    async addConfig(config: ViewConfigInterface): Promise<void> {
        this._paths = this._paths.concat(config.paths);
    }

    async start() {
        for (const path of this._paths) {
            await this._compileTemplates(path);
        }
    }

    get paths(): string[] {
        return this._paths;
    }

    async render(
        filePath: string,
        locals: { [key: string]: any },
        callback: (val: any, renderedHTML?: any) => void,
    ): Promise<void> {
        if ('function' !== typeof this._templates[filePath]) {
            throw new Error(`template ${filePath} does not exists`);
        }

        if ('string' !== typeof locals.locale || 0 === locals.locale.length) {
            locals.locale = null;
        }

        /*
        locals.view = {};
        
        for (const viewHelper of Object.values(await Container.getViewHelpers())) {
            let viewHelperName = viewHelper.constructor.name.replace('ViewHelper', '');
            viewHelperName = viewHelperName.charAt(0).toLowerCase() + viewHelperName.slice(1);

            locals.view[viewHelperName] = viewHelper.render.bind(viewHelper);
        }*/

        try {
            return callback(null, this._templates[filePath](locals, { cache: true }));
        } catch (err) {
            return callback(err);
        }
    }

    protected async _compileTemplates(path: string) {
        if (await this._fileSystem.isDirectory(path)) {
            for (const fileName of await this._fileSystem.readDirectory(path)) {
                await this._compileTemplates(nodePath.join(path, fileName));
            }
        } else if (await this._fileSystem.isFile(path)) {
            this._templates[path] = pug.compileFile(path, {
                filename: path,
            });
        }
    }
}
