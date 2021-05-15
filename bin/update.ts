#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import ncu from 'npm-check-updates';
import path from 'path';

class Update {
    protected static packagesPath = 'packages';

    static async run(): Promise<void> {
        await this.clean();
        await this.updatePackages();
        await this.updateIndexFiles();
    }

    static async updateIndexFiles(): Promise<void> {
        const packagesPath = path.join(Environment.projectPath, 'packages');

        const entries = await FileSystem.readDirectory(packagesPath);

        for (const entry of entries) {
            const pathOfEntry = path.join(packagesPath, entry);

            if (!(await FileSystem.isDirectory(pathOfEntry))) {
                continue;
            }

            const fileList = await FileSystem.listFiles(pathOfEntry);
            const pathToIndexFile = path.join(pathOfEntry, 'index.ts');

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

    static async updatePackages(): Promise<void> {
        await ncu.run({
            packageFile: path.join(Environment.projectPath, 'package.json'),
            upgrade: true,
        });

        for (const name of await FileSystem.readDirectory(this.packagesPath)) {
            // prevent using path segements like .DS_Store
            if (name.startsWith('.')) {
                continue;
            }

            const pathToPackageJson = path.join(this.packagesPath, name, 'package.json');
            const pathToNpmIgnore = path.join(this.packagesPath, name, '.npmignore');
            const pathToNpmrc = path.join(this.packagesPath, name, '.npmrc');
            const packageJson = JSON.parse(await FileSystem.readFile(pathToPackageJson));

            delete packageJson.main;

            packageJson.name = '@vokus/' + name;
            packageJson.description = '@vokus/' + name;
            packageJson.license = 'MIT';
            packageJson.types = 'index.d.ts';
            packageJson.publishConfig = {
                access: 'public',
            };
            packageJson.repository = {
                directory: path.join(this.packagesPath, name),
                type: 'git',
                url: 'https://github.com/vokus/vokus',
            };

            await FileSystem.writeFile(pathToPackageJson, JSON.stringify(packageJson, null, 4) + '\n');

            await ncu.run({
                packageFile: pathToPackageJson,
                upgrade: true,
            });

            const npmignoreContent =
                '# ignore the .scss files' +
                '\n' +
                '**/*.scss' +
                '\n' +
                '# ignore the .ts files' +
                '\n' +
                '**/*.ts' +
                '\n' +
                '# include the .d.ts files' +
                '\n' +
                '!*.d.ts' +
                '\n';

            await FileSystem.writeFile(pathToNpmIgnore, npmignoreContent);

            const npmrcContent = 'engine-strict=true' + '\n' + 'package-lock=false' + '\n';

            await FileSystem.writeFile(pathToNpmrc, npmrcContent);
        }
    }

    protected static async clean(): Promise<void> {
        await this.cleanDirectory(path.join(Environment.projectPath, 'packages'));
        await this.cleanDirectory(path.join(Environment.projectPath, 'var'));
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

Update.run();
