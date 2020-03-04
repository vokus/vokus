#!/usr/bin/env node
import https from 'https';
import path from 'path';
import { BadgeInterface } from '../interface/badge.interface';
import { EnvironmentComponent } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';

class Badge {
    protected static badges: BadgeInterface[] = [
        {
            key: 'coverage',
            label: 'coverage',
            color: 'blue',
            style: 'flat-square',
        },
    ];

    public static async run(): Promise<void> {
        for (const badge of this.badges) {
            const pathToBadge = path.join(EnvironmentComponent.getProjectPath(), 'badge', badge.key + '.svg');
            await FileSystem.ensureFileExists(pathToBadge);
            const badgeFile = FileSystem.createWriteStream(pathToBadge);

            https.get('https://img.shields.io/static/v1?label=' + badge.label, response => {
                response.pipe(badgeFile);
            });
        }
    }
}

Badge.run();
