#!/usr/bin/env node

import { FileSystemComponent } from '@vokus/file-system';
import ncu from 'npm-check-updates';
import path from 'path';

class UpdatePackages {
    protected static packagesPath = 'packages';

    public static async run(): Promise<void> {
        for (const name of await FileSystemComponent.readDirectory(this.packagesPath)) {
            // prevent using path segements like .DS_Store
            if (name.startsWith('.')) {
                continue;
            }

            const pathToPackageJson = path.join(this.packagesPath, name, 'package.json');
            const pathToNpmIgnore = path.join(this.packagesPath, name, '.npmignore');
            const pathToNpmrc = path.join(this.packagesPath, name, '.npmrc');
            const packageJson = JSON.parse(await FileSystemComponent.readFile(pathToPackageJson));

            packageJson.name = '@vokus/' + name;
            packageJson.description = '@vokus/' + name;
            packageJson.license = 'MIT';
            packageJson.main = 'index.js';
            packageJson.types = 'index.d.ts';
            packageJson.publishConfig = {
                access: 'public',
            };
            packageJson.repository = {
                type: 'git',
                url: 'https://github.com/vokus/vokus',
                directory: path.join(this.packagesPath, name),
            };

            await FileSystemComponent.writeFile(pathToPackageJson, JSON.stringify(packageJson, null, 4) + '\n');

            await ncu.run({
                upgrade: true,
                packageFile: pathToPackageJson,
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

            await FileSystemComponent.writeFile(pathToNpmIgnore, npmignoreContent);

            const npmrcContent = 'engine-strict=true' + '\n' + 'package-lock=false' + '\n';

            await FileSystemComponent.writeFile(pathToNpmrc, npmrcContent);
        }
    }
}

UpdatePackages.run();
