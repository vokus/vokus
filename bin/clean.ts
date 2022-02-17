#!/usr/bin/env node

import { FileSystem } from '../packages/file-system';
import path from 'path';

class Clean {
    static async run(): Promise<void> {
        await Promise.all([
            this.clean(path.join(process.cwd(), 'packages')),
            FileSystem.remove(path.join(process.cwd(), 'public')),
        ]);
    }

    protected static async clean(directory: string): Promise<void> {
        if (!(await FileSystem.isDirectory(directory))) {
            return;
        }

        const entries = await FileSystem.readDirectory(directory);

        for (const entry of entries) {
            const fullPath = path.join(directory, entry);

            if ('node_modules' === entry) {
                await FileSystem.remove(fullPath);
            }

            if (await FileSystem.isDirectory(fullPath)) {
                await this.clean(fullPath);
                continue;
            }

            if (!(await FileSystem.isFile(fullPath))) {
                continue;
            }

            if (['.css', '.js', '.d.ts', '.log'].some((ext) => fullPath.endsWith(ext))) {
                await FileSystem.remove(fullPath);
            }
        }

        if (0 === (await FileSystem.readDirectory(directory)).length) {
            await FileSystem.remove(directory);
        }
    }
}

Clean.run();
