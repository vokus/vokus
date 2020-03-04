#!/usr/bin/env node

import path from 'path';
import { FileSystem } from '@vokus/file-system';

// TODO: add files only .js und .d.ts
class UpdatePackages {
    protected static packagesPath = 'packages';

    public static async run(): Promise<void> {
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
            packageJson.publishConfig = {
                access: 'public',
            };
            packageJson.repository = {
                type: 'git',
                url: 'https://github.com/vokus/vokus',
                directory: path.join(this.packagesPath, name),
            };

            await FileSystem.writeFile(pathToPackageJson, JSON.stringify(packageJson, null, 4) + '\n');

            await FileSystem.writeFile(pathToNpmIgnore, '**/*.ts' + '\n');

            await FileSystem.writeFile(pathToNpmrc, 'engine-strict=true' + '\n' + 'package-lock=false' + '\n');
        }
    }
}

UpdatePackages.run();
