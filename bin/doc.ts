#!/usr/bin/env node

import { Environment } from '../packages/environment';
import { FileSystem } from '../packages/file-system/index';
import path from 'path';

class Doc {
    static async run(): Promise<void> {
        await this.buildDependenciesOverview();
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

                            if ('string' === typeof from && !from.startsWith('.') && !from.startsWith('@vokus/')) {
                                external.push(tab + tab + from);
                                relations.push(tab + key + '-->' + from);
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
}

Doc.run();
