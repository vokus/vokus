#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import nodePath from 'path';

class UpdateIndexFiles {
    static async run(): Promise<void> {
        await this.cleanDirectory(nodePath.join(Environment.projectPath, 'packages'));
        await this.cleanDirectory(nodePath.join(Environment.projectPath, 'var'));
    }

    protected static async cleanDirectory(path: string): Promise<void> {
        if (!(await FileSystem.isDirectory(path))) {
            return;
        }

        let entries = await FileSystem.readDirectory(path);

        for (const entry of entries) {
            const fullPath = nodePath.join(path, entry);

            if ('node_modules' === entry) {
                await FileSystem.remove(fullPath);
            }

            if (await FileSystem.isDirectory(fullPath)) {
                await this.cleanDirectory(fullPath);
                continue;
            }

            if (!(await FileSystem.isFile(fullPath))) {
                continue;
            }

            if (
                fullPath.endsWith('.css') ||
                fullPath.endsWith('.js') ||
                fullPath.endsWith('.d.ts') ||
                fullPath.endsWith('.log')
            ) {
                await FileSystem.remove(fullPath);
            }
        }

        entries = await FileSystem.readDirectory(path);

        if (0 === entries.length) {
            await FileSystem.remove(path);
        }
    }
}

UpdateIndexFiles.run();
