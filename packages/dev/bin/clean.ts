#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { ObjectManager } from '@vokus/dependency-injection';
import nodePath from 'path';

class Clean {
    static async run(): Promise<void> {
        await this.cleanDirectory(nodePath.join(Environment.projectPath, 'packages'));
        await this.cleanDirectory(nodePath.join(Environment.projectPath, 'var'));
    }

    protected static async cleanDirectory(path: string): Promise<void> {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);

        if (!(await fileSystem.isDirectory(path))) {
            return;
        }

        let entries = await fileSystem.readDirectory(path);

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

            if (
                fullPath.endsWith('.css') ||
                fullPath.endsWith('.js') ||
                fullPath.endsWith('.d.ts') ||
                fullPath.endsWith('.log')
            ) {
                await fileSystem.remove(fullPath);
            }
        }

        entries = await fileSystem.readDirectory(path);

        if (0 === entries.length) {
            await fileSystem.remove(path);
        }
    }
}

Clean.run();
