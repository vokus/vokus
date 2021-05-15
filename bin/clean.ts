#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import path from 'path';

class Clean {
    static async run(): Promise<void> {
        await Promise.all([
            this.cleanDirectory(path.join(Environment.projectPath, 'packages')),
            this.cleanDirectory(path.join(Environment.projectPath, 'var')),
        ]);
    }

    protected static async cleanDirectory(directory: string): Promise<void> {
        if (!(await FileSystem.isDirectory(directory))) {
            return;
        }

        let entries = await FileSystem.readDirectory(directory);

        for (const entry of entries) {
            const fullPath = path.join(directory, entry);

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

        entries = await FileSystem.readDirectory(directory);

        if (0 === entries.length) {
            await FileSystem.remove(directory);
        }
    }
}

Clean.run();
