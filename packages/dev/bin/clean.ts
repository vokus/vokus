#!/usr/bin/env node
import nodePath from 'path';
import { EnvironmentComponent } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';

class Clean {
    public static async run(): Promise<void> {
        const path = nodePath.join(EnvironmentComponent.getProjectPath(), 'packages');

        await this.cleanDirectory(path);
    }

    protected static async cleanDirectory(path: string): Promise<void> {
        const entries = await FileSystem.readDirectory(path);

        if (entries.length === 0) {
            await FileSystem.remove(path);
        }

        for (const entry of entries) {
            const fullPath = nodePath.join(path, entry);

            if (entry === 'node_modules') {
                await FileSystem.remove(fullPath);
            }

            if (await FileSystem.isDirectory(fullPath)) {
                await this.cleanDirectory(fullPath);
                continue;
            }

            if (!(await FileSystem.isFile(fullPath))) {
                continue;
            }

            if (fullPath.endsWith('.js') || fullPath.endsWith('.d.ts')) {
                await FileSystem.remove(fullPath);
            }
        }
    }
}

Clean.run();
