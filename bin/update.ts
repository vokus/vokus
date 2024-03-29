#!/usr/bin/env node

import { FileSystem } from '../packages/file-system';
import ncu from 'npm-check-updates';
import path from 'path';

class Update {
    protected static packagesPath = 'packages';

    static async run(): Promise<void> {
        await this.updatePackages();
        await this.updateIndexFiles();
    }

    static async updateIndexFiles(): Promise<void> {
        const packagesPath = path.join(process.cwd(), 'packages');

        const entries = await FileSystem.readDirectory(packagesPath);

        for (const entry of entries) {
            const fullPath = path.join(packagesPath, entry);

            if (!(await FileSystem.isDirectory(fullPath))) {
                continue;
            }

            const fileList = await FileSystem.listFiles(fullPath);
            const pathToIndexFile = path.join(fullPath, 'index.ts');

            await FileSystem.ensureFileExists(pathToIndexFile);
            await FileSystem.writeFile(pathToIndexFile, '');

            for (let filePath of fileList) {
                filePath = filePath.replace(fullPath + '/', '');

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
        const updatePromises = [];

        updatePromises.push(
            ncu({
                packageFile: path.join(process.cwd(), 'package.json'),
                upgrade: true,
            }),
        );

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

            updatePromises.push(
                ncu({
                    packageFile: pathToPackageJson,
                    upgrade: true,
                }),
            );

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

        await Promise.all(updatePromises);
    }
}

Update.run();
