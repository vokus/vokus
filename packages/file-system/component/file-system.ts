import nodeFs from 'fs';
import nodePath from 'path';

export class FileSystem {
    static async appendFile(path: string, data: string): Promise<void> {
        return nodeFs.promises.appendFile(path, data, 'utf8');
    }

    static appendFileSync(path: string, data: string): void {
        return nodeFs.appendFileSync(path, data, 'utf8');
    }

    static copyFileSync(src: string, dest: string, flags?: number): void {
        this.ensureFileExistsSync(dest);
        return nodeFs.copyFileSync(src, dest, flags);
    }

    static async copyFile(src: string, dest: string, flags?: number): Promise<void> {
        await this.ensureFileExists(dest);
        return nodeFs.promises.copyFile(src, dest, flags);
    }

    static async ensureDirectoryExists(path: string): Promise<string> {
        return nodeFs.promises.mkdir(path, { recursive: true });
    }

    static ensureDirectoryExistsSync(path: string): string {
        return nodeFs.mkdirSync(path, { recursive: true });
    }

    static async ensureFileExists(path: string): Promise<void> {
        try {
            await nodeFs.promises.access(path, nodeFs.constants.R_OK);
        } catch (e) {
            await this.ensureDirectoryExists(nodePath.dirname(path));
        }

        return this.appendFile(path, '');
    }

    static ensureFileExistsSync(path: string): void {
        try {
            nodeFs.accessSync(path, nodeFs.constants.R_OK);
        } catch (e) {
            this.ensureDirectoryExistsSync(nodePath.dirname(path));
        }

        return nodeFs.appendFileSync(path, '');
    }

    static async isDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isDirectory();
        } catch (err) {
            return false;
        }
    }

    static isDirectorySync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isDirectory();
        } catch (err) {
            return false;
        }
    }

    static async isFile(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isFile();
        } catch (err) {
            return false;
        }
    }

    static isFileSync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isFile();
        } catch (err) {
            return false;
        }
    }

    static async isSymlink(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isSymbolicLink();
        } catch (err) {
            return false;
        }
    }

    static isSymlinkSync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isSymbolicLink();
        } catch (err) {
            return false;
        }
    }

    static async isSymlinkToDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.stat(path)).isDirectory() && (await this.isSymlink(path));
        } catch (err) {
            return false;
        }
    }

    // TODO: optimize and use readDirectory
    static async listFiles(path: string): Promise<string[]> {
        let files: string[] = [];

        for (const entry of await this.readDirectory(path)) {
            const pathOfEntry = nodePath.join(path, entry);

            if (await this.isDirectory(pathOfEntry)) {
                files = files.concat(await this.listFiles(pathOfEntry));
            } else {
                files.push(pathOfEntry);
            }
        }

        return files;
    }

    static async readDirectory(path: string): Promise<string[]> {
        return nodeFs.promises.readdir(path, 'utf8');
    }

    static async readFile(path: string): Promise<string> {
        return nodeFs.promises.readFile(path, 'utf8');
    }

    static readFileSync(path: string): string {
        return nodeFs.readFileSync(path, 'utf8');
    }

    static async remove(path: string): Promise<void> {
        if ((await this.isFile(path)) || (await this.isSymlink(path))) {
            await nodeFs.promises.unlink(path);
        } else if (await this.isDirectory(path)) {
            for (const file of await this.readDirectory(path)) {
                await this.remove(nodePath.join(path, file));
            }

            await nodeFs.promises.rmdir(path);
        }
    }

    static removeSync(path: string): void {
        if (this.isFileSync(path) || this.isSymlinkSync(path)) {
            nodeFs.unlinkSync(path);
        } else if (this.isDirectorySync(path)) {
            for (const file of nodeFs.readdirSync(path)) {
                this.removeSync(nodePath.join(path, file));
            }

            nodeFs.rmdirSync(path);
        }
    }

    static async rename(sourcePath: string, targetPath: string): Promise<void> {
        return nodeFs.promises.rename(sourcePath, targetPath);
    }

    static async symlink(sourcePath: string, targetPath: string): Promise<void> {
        return nodeFs.promises.symlink(sourcePath, targetPath);
    }

    static symlinkSync(sourcePath: string, targetPath: string): void {
        return nodeFs.symlinkSync(sourcePath, targetPath);
    }

    static async writeFile(path: string, data: string): Promise<void> {
        return nodeFs.promises.writeFile(path, data, 'utf8');
    }

    static writeFileSync(path: string, data: string): void {
        return nodeFs.writeFileSync(path, data, 'utf8');
    }
}
