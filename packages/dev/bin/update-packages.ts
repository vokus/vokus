#!/usr/bin/env node

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import ncu from 'npm-check-updates';
import path from 'path';

class UpdatePackages {
    protected static packagesPath = 'packages';

    static async run(): Promise<void> {
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
}

UpdatePackages.run();
