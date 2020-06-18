#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import https from 'https';
import path from 'path';

class Shields {
    static async run(): Promise<void> {
        // get shields from package.json
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
            const shieldFile = FileSystem.createWriteStream(pathToShield);

            https.get(
                'https://img.shields.io/static/v1?label=' +
                    shield.label +
                    '&message=' +
                    shield.message +
                    '&color=' +
                    shield.color +
                    '&style=' +
                    shield.style,
                (response) => {
                    response.pipe(shieldFile);
                },
            );
        }
    }
}

Shields.run();
