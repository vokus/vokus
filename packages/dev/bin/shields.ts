#!/usr/bin/env node

import { BadgeInterface } from '../interface/badge.interface';
import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import https from 'https';
import path from 'path';

class Shields {
    static async run(): Promise<void> {
        // get shields from package.json
        const shields: BadgeInterface[] = JSON.parse(
            await FileSystem.readFile(path.join(Environment.projectPath, 'package.json')),
        ).shields;

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
