import nodeFs from 'fs';
import nodePath from 'path';

export class FileSystemComponent {
    public static async appendFile(path: string, data: any): Promise<void> {
        return nodeFs.promises.appendFile(path, data, 'utf8');
    }

    public static appendFileSync(path: string, data: any): void {
        return nodeFs.appendFileSync(path, data, 'utf8');
    }

    public static createWriteStream(path: string): nodeFs.WriteStream {
        return nodeFs.createWriteStream(path);
    }

    public static async ensureDirectoryExists(path: string): Promise<void> {
        return nodeFs.promises.mkdir(path, { recursive: true });
    }

    public static ensureDirectoryExistsSync(path: string): void {
        return nodeFs.mkdirSync(path, { recursive: true });
    }

    public static async ensureFileExists(path: string): Promise<void> {
        try {
            await nodeFs.promises.access(path, nodeFs.constants.R_OK);
        } catch (e) {
            await this.ensureDirectoryExists(nodePath.dirname(path));
        }

        return this.appendFile(path, '');
    }

    public static ensureFileExistsSync(path: string): void {
        try {
            nodeFs.accessSync(path, nodeFs.constants.R_OK);
        } catch (e) {
            this.ensureDirectoryExistsSync(nodePath.dirname(path));
        }

        return nodeFs.appendFileSync(path, '');
    }

    public static async isDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isDirectory();
        } catch (err) {
            return false;
        }
    }

    public static isDirectorySync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isDirectory();
        } catch (err) {
            return false;
        }
    }

    public static async isFile(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isFile();
        } catch (err) {
            return false;
        }
    }

    public static isFileSync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isFile();
        } catch (err) {
            return false;
        }
    }

    public static async isSymlink(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isSymbolicLink();
        } catch (err) {
            return false;
        }
    }

    public static isSymlinkSync(path: string): boolean {
        try {
            return nodeFs.lstatSync(path).isSymbolicLink();
        } catch (err) {
            return false;
        }
    }

    public static async isSymlinkToDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.stat(path)).isDirectory() && (await this.isSymlink(path));
        } catch (err) {
            return false;
        }
    }

    public static async readDirectory(path: string): Promise<string[]> {
        return nodeFs.promises.readdir(path, 'utf8');
    }

    public static async readFile(path: string): Promise<string> {
        return nodeFs.promises.readFile(path, 'utf8');
    }

    public static readFileSync(path: string): string {
        return nodeFs.readFileSync(path, 'utf8');
    }

    public static async remove(path: string): Promise<void> {
        if ((await this.isFile(path)) || (await this.isSymlink(path))) {
            await nodeFs.promises.unlink(path);
        } else if (await this.isDirectory(path)) {
            for (const file of await this.readDirectory(path)) {
                await this.remove(nodePath.join(path, file));
            }

            await nodeFs.promises.rmdir(path);
        }
    }

    public static removeSync(path: string): void {
        if (this.isFileSync(path) || this.isSymlinkSync(path)) {
            nodeFs.unlinkSync(path);
        } else if (this.isDirectorySync(path)) {
            for (const file of nodeFs.readdirSync(path)) {
                this.removeSync(nodePath.join(path, file));
            }

            nodeFs.rmdirSync(path);
        }
    }

    public static async rename(sourcePath: string, targetPath: string): Promise<void> {
        return nodeFs.promises.rename(sourcePath, targetPath);
    }

    public static async symlink(sourcePath: string, targetPath: string): Promise<void> {
        return nodeFs.promises.symlink(sourcePath, targetPath);
    }

    public static symlinkSync(sourcePath: string, targetPath: string): void {
        return nodeFs.symlinkSync(sourcePath, targetPath);
    }

    public static async writeFile(path: string, data: any): Promise<void> {
        return nodeFs.promises.writeFile(path, data, 'utf8');
    }

    public static writeFileSync(path: string, data: any): void {
        return nodeFs.writeFileSync(path, data, 'utf8');
    }
}
