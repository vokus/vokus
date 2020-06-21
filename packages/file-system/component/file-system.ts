import { Injectable } from '@vokus/dependency-injection';
import nodeFs from 'fs';
import nodePath from 'path';

@Injectable()
export class FileSystem {
    async appendFile(path: string, data: string): Promise<void> {
        return nodeFs.promises.appendFile(path, data, 'utf8');
    }

    appendFileSync(path: string, data: string): void {
        return nodeFs.appendFileSync(path, data, 'utf8');
    }

    createWriteStream(path: string): nodeFs.WriteStream {
        return nodeFs.createWriteStream(path);
    }

    copyFileSync(src: string, dest: string, flags?: number): void {
        this.ensureFileExistsSync(dest);
        return nodeFs.copyFileSync(src, dest, flags);
    }

    async copyFile(src: string, dest: string, flags?: number): Promise<void> {
        await this.ensureFileExists(dest);
        return nodeFs.promises.copyFile(src, dest, flags);
    }

    async ensureDirectoryExists(path: string): Promise<string> {
        return nodeFs.promises.mkdir(path, { recursive: true });
    }

    ensureDirectoryExistsSync(path: string): string {
        return nodeFs.mkdirSync(path, { recursive: true });
    }

    async ensureFileExists(path: string): Promise<void> {
        try {
            await nodeFs.promises.access(path, nodeFs.constants.R_OK);
        } catch (e) {
            await this.ensureDirectoryExists(nodePath.dirname(path));
        }

        return this.appendFile(path, '');
    }

    ensureFileExistsSync(path: string): void {
        try {
            nodeFs.accessSync(path, nodeFs.constants.R_OK);
        } catch (e) {
            this.ensureDirectoryExistsSync(nodePath.dirname(path));
        }

        return nodeFs.appendFileSync(path, '');
    }

    async isDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isDirectory();
        } catch (err) {
            return false;
        }
    }

    isDirectorySync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isDirectory();
        } catch (err) {
            return false;
        }
    }

    async isFile(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isFile();
        } catch (err) {
            return false;
        }
    }

    isFileSync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isFile();
        } catch (err) {
            return false;
        }
    }

    async isSymlink(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isSymbolicLink();
        } catch (err) {
            return false;
        }
    }

    isSymlinkSync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isSymbolicLink();
        } catch (err) {
            return false;
        }
    }

    async isSymlinkToDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.stat(path)).isDirectory() && (await this.isSymlink(path));
        } catch (err) {
            return false;
        }
    }

    async readDirectory(path: string): Promise<string[]> {
        return nodeFs.promises.readdir(path, 'utf8');
    }

    async readFile(path: string): Promise<string> {
        return nodeFs.promises.readFile(path, 'utf8');
    }

    readFileSync(path: string): string {
        return nodeFs.readFileSync(path, 'utf8');
    }

    async remove(path: string): Promise<void> {
        if ((await this.isFile(path)) || (await this.isSymlink(path))) {
            await nodeFs.promises.unlink(path);
        } else if (await this.isDirectory(path)) {
            for (const file of await this.readDirectory(path)) {
                await this.remove(nodePath.join(path, file));
            }

            await nodeFs.promises.rmdir(path);
        }
    }

    removeSync(path: string): void {
        if (this.isFileSync(path) || this.isSymlinkSync(path)) {
            nodeFs.unlinkSync(path);
        } else if (this.isDirectorySync(path)) {
            for (const file of nodeFs.readdirSync(path)) {
                this.removeSync(nodePath.join(path, file));
            }

            nodeFs.rmdirSync(path);
        }
    }

    async rename(sourcePath: string, targetPath: string): Promise<void> {
        return nodeFs.promises.rename(sourcePath, targetPath);
    }

    async symlink(sourcePath: string, targetPath: string): Promise<void> {
        return nodeFs.promises.symlink(sourcePath, targetPath);
    }

    symlinkSync(sourcePath: string, targetPath: string): void {
        return nodeFs.symlinkSync(sourcePath, targetPath);
    }

    async writeFile(path: string, data: string): Promise<void> {
        return nodeFs.promises.writeFile(path, data, 'utf8');
    }

    writeFileSync(path: string, data: string): void {
        return nodeFs.writeFileSync(path, data, 'utf8');
    }
}
