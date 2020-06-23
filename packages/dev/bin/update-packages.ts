#!/usr/bin/env node

import { FileSystem } from '@vokus/file-system';
import { ObjectManager } from '@vokus/dependency-injection';
import ncu from 'npm-check-updates';
import path from 'path';
import { Environment } from '@vokus/environment';

class UpdatePackages {
    protected static packagesPath = 'packages';

    static async run(): Promise<void> {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);

        await ncu.run({
            packageFile: path.join(Environment.projectPath, 'package.json'),
            upgrade: true,
        });

        for (const name of await fileSystem.readDirectory(this.packagesPath)) {
            // prevent using path segements like .DS_Store
            if (name.startsWith('.')) {
                continue;
            }

            const pathToPackageJson = path.join(this.packagesPath, name, 'package.json');
            const pathToNpmIgnore = path.join(this.packagesPath, name, '.npmignore');
            const pathToNpmrc = path.join(this.packagesPath, name, '.npmrc');
            const packageJson = JSON.parse(await fileSystem.readFile(pathToPackageJson));

            packageJson.name = '@vokus/' + name;
            packageJson.description = '@vokus/' + name;
            packageJson.license = 'MIT';
            packageJson.main = 'index.js';
            packageJson.types = 'index.d.ts';
            packageJson.publishConfig = {
                access: 'public',
            };
            packageJson.repository = {
                directory: path.join(this.packagesPath, name),
                type: 'git',
                url: 'https://github.com/vokus/vokus',
            };

            await fileSystem.writeFile(pathToPackageJson, JSON.stringify(packageJson, null, 4) + '\n');

            await ncu.run({
                packageFile: pathToPackageJson,
                upgrade: true,
            });

            const npmignoreContent =
                '# ignore the .ts files' +
                '\n' +
                '**/*.ts' +
                '\n' +
                '# include the .d.ts files' +
                '\n' +
                '!*.d.ts' +
                '\n';

            await fileSystem.writeFile(pathToNpmIgnore, npmignoreContent);

            const npmrcContent = 'engine-strict=true' + '\n' + 'package-lock=false' + '\n';

            await fileSystem.writeFile(pathToNpmrc, npmrcContent);
        }
    }
}

UpdatePackages.run();
