#!/usr/bin/env node
import https from 'https';
import path from 'path';
import { BadgeInterface } from '../interface/badge.interface';
import { EnvironmentComponent } from '@vokus/environment';
import { FileSystemComponent } from '@vokus/file-system';

class Badge {
    protected static badges: BadgeInterface[] = [
        {
            key: 'coverage',
            label: 'coverage',
            message: '100%',
            color: 'blue',
            style: 'flat-square',
        },
        {
            key: 'code-style',
            label: 'code style',
            message: 'pretier',
            color: 'ff69b4',
            style: 'flat-square',
        },
    ];

    public static async run(): Promise<void> {
        for (const badge of this.badges) {
            const pathToBadge = path.join(EnvironmentComponent.projectPath, 'badge', badge.key + '.svg');

            await FileSystemComponent.ensureFileExists(pathToBadge);
            const badgeFile = FileSystemComponent.createWriteStream(pathToBadge);

            https.get(
                'https://img.shields.io/static/v1?label=' +
                    badge.label +
                    '&message=' +
                    badge.message +
                    '&color=' +
                    badge.color +
                    '&style=' +
                    badge.style,
                response => {
                    response.pipe(badgeFile);
                },
            );
        }
    }
}

Badge.run();
