#!/usr/bin/env node

import { BadgeInterface } from '../interface/badge.interface';
import { EnvironmentComponent } from '@vokus/environment';
import { FileSystemComponent } from '@vokus/file-system';
import https from 'https';
import path from 'path';

class Shields {
    public static async run(): Promise<void> {
        // get shields from package.json
        const shields: BadgeInterface[] = JSON.parse(
            await FileSystemComponent.readFile(path.join(EnvironmentComponent.projectPath, 'package.json')),
        ).shields;

        // request shields from shield.io and write them to shields folder
        for (const shield of shields) {
            const pathToShield = path.join(EnvironmentComponent.projectPath, 'shields', shield.key + '.svg');

            await FileSystemComponent.ensureFileExists(pathToShield);
            const shieldFile = FileSystemComponent.createWriteStream(pathToShield);

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
