#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// TODO: add files only .js und .d.ts
class UpdateAndCleanPackages {
    protected static packagesPath = 'packages';

    public static async run(): Promise<void> {
        for (const name of fs.readdirSync(this.packagesPath)) {
            // prevent using path segements like .DS_Store
            if (name.startsWith('.')) {
                continue;
            }

            const pathToPackageJson = path.join(this.packagesPath, name, 'package.json');
            const pathToTsConfigJson = path.join(this.packagesPath, name, 'tsconfig.json');
            const pathToNpmIgnore = path.join(this.packagesPath, name, '.npmignore');
            const pathToNpmrc = path.join(this.packagesPath, name, '.npmrc');
            const packageJson = JSON.parse(fs.readFileSync(pathToPackageJson, 'utf8'));

            packageJson.name = '@vokus/' + name;
            packageJson.description = '@vokus/' + name;
            packageJson.license = 'MIT';
            packageJson.publishConfig = {
                access: 'public',
            };
            packageJson.repository = {
                type: 'git',
                url: 'https://github.com/vokus/vokus',
                directory: path.join(this.packagesPath, name),
            };

            fs.writeFileSync(pathToPackageJson, JSON.stringify(packageJson, null, 4) + '\n');

            if (fs.existsSync(pathToTsConfigJson)) {
                fs.unlinkSync(pathToTsConfigJson);
            }

            if (fs.existsSync(pathToNpmIgnore)) {
                fs.unlinkSync(pathToNpmIgnore);
            }

            fs.writeFileSync(pathToNpmIgnore, '**/*.ts' + '\n');

            fs.writeFileSync(pathToNpmrc, 'engine-strict=true' + '\n' + 'package-lock=false' + '\n');
        }
    }
}

UpdateAndCleanPackages.run();
