import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { HttpClient } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';
import path from 'path';

@Injectable()
export class Shields {
    protected _httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this._httpClient = httpClient;
    }

    async start(): Promise<void> {
        const shields: {
            key: string;
            label: string;
            message: string;
            color: string;
            style: string;
        }[] = JSON.parse(await FileSystem.readFile(path.join(Environment.projectPath, '.shields.json')));

        // request shields from shield.io and write them to shields folder
        for (const shield of shields) {
            const pathToShield = path.join(Environment.projectPath, 'shields', shield.key + '.svg');

            await FileSystem.ensureFileExists(pathToShield);

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

            await FileSystem.writeFile(pathToShield, res.body);
        }
    }
}
