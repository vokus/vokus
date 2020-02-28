import nodeFs from 'fs';
import nodePath from 'path';

export class FileSystem {
    public static async appendFile(path: string, data: any): Promise<void> {
        return nodeFs.promises.appendFile(path, data, 'utf8');
    }

    public static async ensureDirectoryExists(path: string): Promise<void> {
        return nodeFs.promises.mkdir(path, { recursive: true });
    }

    public static async ensureFileExists(path: string): Promise<void> {
        try {
            return await nodeFs.promises.access(path, nodeFs.constants.R_OK);
        } catch (err) {
            this.ensureDirectoryExists(nodePath.dirname(path));
        }

        return nodeFs.promises.appendFile(path, '');
    }

    public static async isDirectory(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isDirectory();
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

    public static async isSymlink(path: string): Promise<boolean> {
        try {
            return (await nodeFs.promises.lstat(path)).isSymbolicLink();
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

    public static async remove(path: string): Promise<void> {
        if ((await this.isFile(path)) || (await this.isSymlink(path))) {
            await nodeFs.promises.unlink(path);
        } else if (await this.isDirectory(path)) {
            for (const file of await nodeFs.promises.readdir(path)) {
                await this.remove(nodePath.join(path, file));
            }

            await nodeFs.promises.rmdir(path);
        }
    }

    public static async rename(sourcePath: string, targetPath: string): Promise<void> {
        return nodeFs.promises.rename(sourcePath, targetPath);
    }

    public static async symlink(sourcePath: string, targetPath: string) {
        return nodeFs.promises.symlink(sourcePath, targetPath);
    }

    public static async writeFile(path: string, data: any): Promise<void> {
        return nodeFs.promises.writeFile(path, data, 'utf8');
    }
}
