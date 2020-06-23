#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { ObjectManager } from '@vokus/dependency-injection';
import nodePath from 'path';

class Clean {
    static async run(): Promise<void> {
        await this.cleanDirectory(nodePath.join(Environment.projectPath, 'packages'));
    }

    protected static async cleanDirectory(path: string): Promise<void> {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const entries = await fileSystem.readDirectory(path);

        if (0 === entries.length) {
            await fileSystem.remove(path);
        }

        for (const entry of entries) {
            const fullPath = nodePath.join(path, entry);

            if ('node_modules' === entry) {
                await fileSystem.remove(fullPath);
            }

            if (await fileSystem.isDirectory(fullPath)) {
                await this.cleanDirectory(fullPath);
                continue;
            }

            if (!(await fileSystem.isFile(fullPath))) {
                continue;
            }

            if (fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.d.ts')) {
                await fileSystem.remove(fullPath);
            }
        }
    }
}

Clean.run();
