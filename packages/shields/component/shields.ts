import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { HTTPClient } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';
import path from 'path';

@Injectable()
export class Shields {
    protected _fileSystem: FileSystem;
    protected _httpClient: HTTPClient;

    constructor(fileSystem: FileSystem, httpClient: HTTPClient) {
        this._fileSystem = fileSystem;
        this._httpClient = httpClient;
    }

    async start(): Promise<void> {
        const shields: {
            key: string;
            label: string;
            message: string;
            color: string;
            style: string;
        }[] = JSON.parse(await this._fileSystem.readFile(path.join(Environment.projectPath, '.shields.json')));

        // request shields from shield.io and write them to shields folder
        for (const shield of shields) {
            const pathToShield = path.join(Environment.projectPath, 'shields', shield.key + '.svg');

            await this._fileSystem.ensureFileExists(pathToShield);

            const res = await this._httpClient.get(
                'https://img.shields.io/static/v1?label=' +
                    shield.label +
                    '&message=' +
                    shield.message +
                    '&color=' +
                    shield.color +
                    '&style=' +
                    shield.style,
            );

            await this._fileSystem.writeFile(pathToShield, res.body);
        }
    }
}
