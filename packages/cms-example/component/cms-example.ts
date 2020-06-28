import { Cms } from '@vokus/cms';
import { CmsExampleConfig } from '../config/cms-example';
import { Injectable } from '@vokus/core';

@Injectable()
export class CmsExample {
    protected _cms: Cms;

    constructor(cms: Cms) {
        this._cms = cms;
    }

    async start() {
        await this._cms.addConfig(CmsExampleConfig);
        await this._cms.start();
    }

    async stop() {
        await this._cms.stop();
    }
}
