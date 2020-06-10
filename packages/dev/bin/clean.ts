#!/usr/bin/env node

import { EnvironmentComponent } from '@vokus/environment';
import { FileSystemComponent } from '@vokus/file-system';
import nodePath from 'path';

class Clean {
    public static async run(): Promise<void> {
        await this.cleanDirectory(nodePath.join(EnvironmentComponent.projectPath, 'packages'));
    }

    protected static async cleanDirectory(path: string): Promise<void> {
        const entries = await FileSystemComponent.readDirectory(path);

        if (0 === entries.length) {
            await FileSystemComponent.remove(path);
        }

        for (const entry of entries) {
            const fullPath = nodePath.join(path, entry);

            if ('node_modules' === entry) {
                await FileSystemComponent.remove(fullPath);
            }

            if (await FileSystemComponent.isDirectory(fullPath)) {
                await this.cleanDirectory(fullPath);
                continue;
            }

            if (!(await FileSystemComponent.isFile(fullPath))) {
                continue;
            }

            if (fullPath.endsWith('.js') || fullPath.endsWith('.d.ts')) {
                await FileSystemComponent.remove(fullPath);
            }
        }
    }
}

Clean.run();
