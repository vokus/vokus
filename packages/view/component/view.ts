import * as nodePath from 'path';
import { FileSystem } from '@vokus/file-system';
import { Injectable, ObjectManager } from '@vokus/dependency-injection';
import { ViewConfigInterface } from '../interface/view-config';
import pug from 'pug';
import { ObjectUtil } from '../../object';
import { ViewHelperInterface } from '../interface/view-helper';

@Injectable()
export class View {
    protected _config: ViewConfigInterface = {
        helpers: [],
        paths: [],
    };
    protected _templates: { [key: string]: any } = {};
    protected _fileSystem: FileSystem;

    constructor(fileSystem: FileSystem) {
        this._fileSystem = fileSystem;
    }

    get config(): ViewConfigInterface {
        return this._config;
    }

    async addConfig(config: ViewConfigInterface): Promise<void> {
        await ObjectUtil.merge(this._config, config);
    }

    async start() {
        for (const path of this._config.paths) {
            await this._compileTemplates(path);
        }
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

        locals.view = {};

        for (const viewHelperConfig of this._config.helpers) {
            const viewHelper: ViewHelperInterface = await ObjectManager.get(viewHelperConfig.helper);
            locals.view[viewHelperConfig.key] = viewHelper.render.bind(viewHelper);
        }

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
