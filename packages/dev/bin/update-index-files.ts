#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import nodePath from 'path';

class UpdateIndexFiles {
    static async run(): Promise<void> {
        const packagesPath = nodePath.join(Environment.projectPath, 'packages');

        const entries = await FileSystem.readDirectory(packagesPath);

        for (const entry of entries) {
            const pathOfEntry = nodePath.join(packagesPath, entry);

            if (!(await FileSystem.isDirectory(pathOfEntry))) {
                continue;
            }

            const fileList = await FileSystem.listFiles(pathOfEntry);
            const pathToIndexFile = nodePath.join(pathOfEntry, 'index.ts');

            await FileSystem.ensureFileExists(pathToIndexFile);
            await FileSystem.writeFile(pathToIndexFile, '');

            for (let filePath of fileList) {
                filePath = filePath.replace(pathOfEntry + '/', '');

                if (
                    !filePath.endsWith('.ts') ||
                    filePath.endsWith('.d.ts') ||
                    filePath.endsWith('.test.ts') ||
                    'index.ts' === filePath ||
                    filePath.startsWith('node_modules/') ||
                    filePath.startsWith('bin/') ||
                    filePath.startsWith('asset/')
                ) {
                    continue;
                }

                filePath = filePath.replace('.ts', '');

                await FileSystem.appendFile(pathToIndexFile, `export * from './${filePath}';\n`);
            }

            if ('' === (await FileSystem.readFile(pathToIndexFile))) {
                await FileSystem.remove(pathToIndexFile);
            }
        }
    }
}

UpdateIndexFiles.run();
