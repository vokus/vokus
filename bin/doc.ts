#!/usr/bin/env node

import Color from 'color';
import { Environment } from '../packages/environment';
import { FileSystem } from '../packages/file-system';
import { HttpClient } from '../packages/core';
import { exec } from 'child_process';
import path from 'path';

class Doc {
    protected static packagesPath = path.join(Environment.projectPath, 'packages');
    protected static mmdPath = path.join(Environment.projectPath, 'doc/mmd');
    protected static tab = '    ';
    protected static colors = {
        darkGreen: Color('#44AD9F').darken(0.3),
        green: Color('#44AD9F'),
        lightGreen: Color('#44AD9F').lighten(0.1),
        darkRed: Color('#FA6135').darken(0.3),
        red: Color('#FA6135'),
        lightRed: Color('#FA6135').lighten(0.1),
    };

    static async run(): Promise<void> {
        await this.builddependenciesOverview();
        await this.buildPNGsFromMmd();
        await this.buildShields();
    }

    static async builddependenciesOverview(): Promise<void> {
        let content: string[] = [];
        const packages = await FileSystem.readDirectory(this.packagesPath);
        const keys: string[] = [];

        // create vokus packages
        for (const packageName of packages) {
            const pathToPackage = path.join(this.packagesPath, packageName);
            const key = '_vokus_' + packageName;

            if (keys.includes(key)) {
                continue;
            }

            keys.push(key);

            let color = this.colors.green.hex();
            let colorLight = this.colors.lightGreen.hex();
            let colorDark = this.colors.darkGreen.hex();

            if ('_vokus_core' === key) {
                color = this.colors.red.hex();
                colorLight = this.colors.lightRed.hex();
                colorDark = this.colors.darkRed.hex();
            }

            content.push('subgraph ' + key + ' [' + packageName + ']');

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
                        const key = path.join('packages', packageName, typeDirectory, fileName.replace('.ts', ''));

                        files.push(this.tab + this.tab + key + '(' + fileName.replace('.ts', '') + ')');
                        content.push(
                            this.tab +
                                this.tab +
                                'style ' +
                                key +
                                ' fill:' +
                                color +
                                ',stroke:' +
                                colorDark +
                                ',stroke-width:1px',
                        );
                    }
                }

                if (0 < files.length) {
                    content.push(
                        this.tab +
                            'subgraph ' +
                            path.join('packages', packageName, typeDirectory) +
                            ' [' +
                            typeDirectory +
                            ']',
                    );

                    content = content.concat(files);

                    content.push(this.tab + 'end');
                    content.push(
                        this.tab +
                            'style ' +
                            path.join('packages', packageName, typeDirectory) +
                            ' fill:' +
                            colorLight +
                            ',stroke:' +
                            colorDark +
                            ',stroke-width:1px',
                    );
                }
            }

            content.push('end');

            content.push('style ' + key + ' fill:' + color + ',stroke:' + colorDark + ',stroke-width:1px');
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
        const mmdContent = ['flowchart TD'];

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

            exec(
                'mmdc -i ' +
                    path.join(this.mmdPath, fileName) +
                    ' -o ' +
                    path.join(this.mmdPath, fileName).replace('.mmd', '.png') +
                    ' -w 4800',
            );
        }
    }

    static async buildShields(): Promise<void> {
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
