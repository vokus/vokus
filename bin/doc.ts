#!/usr/bin/env node

import { Environment } from '../packages/environment';
import { FileSystem } from '../packages/file-system';
import { HttpClient } from '../packages/core';
import { exec } from 'child_process';
import path from 'path';

class Doc {
    protected static packagesPath = path.join(Environment.projectPath, 'packages');
    protected static mmdPath = path.join(Environment.projectPath, 'doc/mmd');
    protected static tab = '    ';

    static async run(): Promise<void> {
        // await this.buildDependenciesOverview();
        await this.buildPackageDependenciesOverview();
        await this.buildPNGsFromMmd();
    }

    static async buildPackageDependenciesOverview(): Promise<void> {
        const content: string[] = [];
        const packages = await FileSystem.readDirectory(this.packagesPath);
        const keys: string[] = [];

        // create vokus packages
        for (const packageName of packages) {
            const key = '_vokus_' + packageName;

            if (keys.includes(key)) {
                continue;
            }

            keys.push(key);

            content.push(key + '(' + packageName + ')');

            let color = '#44AD9F';

            if ('_vokus_core' === key) {
                color = '#FA6135';
            }

            content.push('style ' + key + ' fill:' + color + ',stroke:#333,stroke-width:1px');
        }

        for (const packageName of packages) {
            const packageJson = JSON.parse(
                await FileSystem.readFile(path.join(this.packagesPath, packageName, 'package.json')),
            );

            if ('object' !== typeof packageJson.dependencies) {
                continue;
            }

            for (const dependency of Object.keys(packageJson.dependencies)) {
                const key = dependency.replace('@', '_').replace('/', '_');

                content.push('_vokus_' + packageName + ' --> ' + key);

                if (keys.includes(key)) {
                    continue;
                }

                keys.push(key);

                if (dependency.startsWith('_vokus_')) {
                    continue;
                }

                content.push(key + '(' + dependency + ')');
                content.push('style ' + key + ' fill:#F8AF2C,stroke:#333,stroke-width:1px');
            }
        }
        const mmdContent = ['graph TD'];

        for (const line of content) {
            mmdContent.push(this.tab + line);
        }

        await FileSystem.writeFile(path.join(this.mmdPath, 'package-dependencies.mmd'), mmdContent.join('\n'));
    }

    static async buildPNGsFromMmd(): Promise<void> {
        for (const fileName of await FileSystem.readDirectory(this.mmdPath)) {
            if (!fileName.endsWith('.mmd')) {
                continue;
            }

            const command =
                'mmdc -i ' +
                path.join(this.mmdPath, fileName) +
                ' -o ' +
                path.join(this.mmdPath, fileName).replace('.mmd', '.png') +
                ' -w 4800';

            exec(command);
        }
    }

    private static async getMmdPackageName(packageKey: string): Promise<string> {
        const simpleName = packageKey.replace('@vokus/', '');
        packageKey = packageKey.replace('@', '_').replace('/', '_');

        if (packageKey.startsWith('_vokus_')) {
            return packageKey + '([' + simpleName + '])';
        }

        return packageKey + '[[' + simpleName + ']]';
    }

    static async buildDependenciesOverview(): Promise<void> {
        const pathToDependenciesMermaid = path.join(Environment.projectPath, 'doc/mmd/dependencies.mmd');
        let content: string[] = ['graph TD'];
        let external: string[] = [];
        const relations: string[] = [];
        const tab = '    ';

        const pathToPackages = path.join(Environment.projectPath, 'packages');

        for (const packageDirectory of await FileSystem.readDirectory(pathToPackages)) {
            const pathToPackage = path.join(pathToPackages, packageDirectory);

            if (!(await FileSystem.isDirectory(pathToPackage))) {
                continue;
            }

            content.push(tab + 'subgraph packages/' + packageDirectory + ' [' + packageDirectory + ']');

            for (const typeDirectory of await FileSystem.readDirectory(pathToPackage)) {
                const pathToTypeDirectory = path.join(pathToPackage, typeDirectory);

                if (
                    !(await FileSystem.isDirectory(pathToTypeDirectory)) ||
                    'node_modules' === typeDirectory ||
                    'bin' === typeDirectory ||
                    'asset' === typeDirectory ||
                    'interface' === typeDirectory ||
                    'view' === typeDirectory
                ) {
                    continue;
                }

                const files = [];

                for (const fileName of await FileSystem.readDirectory(pathToTypeDirectory)) {
                    if (fileName.endsWith('.ts') && !fileName.endsWith('.test.ts') && 'index.ts' !== fileName) {
                        const key = path.join(packageDirectory, typeDirectory, fileName.replace('.ts', ''));

                        files.push(tab + tab + tab + key + '(' + fileName.replace('.ts', '') + ')');

                        const content = await FileSystem.readFile(path.join(pathToTypeDirectory, fileName));

                        for (const line of content.split('\n')) {
                            if (!line.includes(" from '") || !line.endsWith("';")) {
                                continue;
                            }
                            const from = line.replace("';", '').split(" from '").pop();

                            if ('string' !== typeof from) {
                                continue;
                            }

                            if (
                                !from.startsWith('.') &&
                                !from.startsWith('@vokus/') &&
                                'path' !== from &&
                                'fs' !== from &&
                                'https' !== from
                            ) {
                                external.push(tab + tab + from);
                                relations.push(tab + key + '-->' + from);
                            } else if (
                                from.startsWith('.') &&
                                !from.includes('/interface/') &&
                                !from.includes('/decorator/')
                            ) {
                                relations.push(tab + key + '-->' + path.join(packageDirectory, typeDirectory, from));
                            }
                        }
                    }
                }

                if (0 < files.length) {
                    content.push(
                        tab +
                            tab +
                            'subgraph ' +
                            path.join(packageDirectory, typeDirectory) +
                            ' [' +
                            typeDirectory +
                            ']',
                    );

                    content = content.concat(files);

                    content.push(tab + tab + 'end');
                }
            }

            content.push(tab + 'end');
        }
        if (0 < external.length) {
            external = external.filter((elem, pos) => {
                return external.indexOf(elem) == pos;
            });

            external = [tab + 'subgraph node_modules'].concat(external).concat([tab + 'end']);
            content = content.concat(external);
        }

        content = content.concat(relations);

        await FileSystem.writeFile(pathToDependenciesMermaid, content.join('\n'));
    }

    static async shields(): Promise<void> {
        const httpClient = new HttpClient();

        const shields: {
            key: string;
            label: string;
            message: string;
            color: string;
            style: string;
        }[] = JSON.parse(await FileSystem.readFile(path.join(Environment.projectPath, '.shields.json')));

        // request shields from shield.io and write them to shields folder
        for (const shield of shields) {
            const pathToShield = path.join(Environment.projectPath, 'doc/shields', shield.key + '.svg');

            await FileSystem.ensureFileExists(pathToShield);

            const url =
                'https://img.shields.io/static/v1?label=' +
                shield.label +
                '&message=' +
                shield.message +
                '&color=' +
                shield.color +
                '&style=' +
                shield.style;

            const res = await httpClient.get(url);

            await FileSystem.writeFile(pathToShield, res.body);
        }
    }
}

Doc.run();
