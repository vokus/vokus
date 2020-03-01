import { FileSystem } from './file-system';
import path from 'path';

const pathToTestDir = path.join(__dirname, 'test');

beforeAll(async () => {
    await FileSystem.remove(pathToTestDir);
    await FileSystem.ensureDirectoryExists(pathToTestDir);
    expect(await FileSystem.isDirectory(pathToTestDir)).toBe(true);
});

afterAll(async () => {
    await FileSystem.remove(pathToTestDir);
    expect(await FileSystem.isDirectory(pathToTestDir)).toBe(false);
});

describe('FileSystem', () => {
    test('appendFile', async () => {
        const testPath = path.join(pathToTestDir, 'append-file');

        await FileSystem.appendFile(testPath, 'append-file');
        expect(await FileSystem.readFile(testPath)).toBe('append-file');
        await FileSystem.appendFile(testPath, '-append-file');
        expect(await FileSystem.readFile(testPath)).toBe('append-file-append-file');
    });

    test('ensureDirectoryExists', async () => {
        const testPath = path.join(pathToTestDir, 'ensure-directory-exists');

        await FileSystem.ensureDirectoryExists(testPath);
        expect(await FileSystem.isDirectory(testPath)).toBe(true);
    });

    test('ensureFileExists', async () => {
        const testPath = path.join(pathToTestDir, 'ensure-file-exists.txt');

        await FileSystem.ensureFileExists(testPath);
        expect(await FileSystem.isFile(testPath)).toBe(true);
    });

    test('isDirectory', async () => {
        const testPath = path.join(pathToTestDir, 'is-directory');

        expect(await FileSystem.isDirectory(testPath)).toBe(false);
        await FileSystem.ensureDirectoryExists(testPath);
        expect(await FileSystem.isDirectory(testPath)).toBe(true);
    });

    test('isFile', async () => {
        const testPath = path.join(pathToTestDir, 'is-file');

        expect(await FileSystem.isFile(testPath)).toBe(false);
        await FileSystem.ensureFileExists(testPath);
        expect(await FileSystem.isFile(testPath)).toBe(true);
    });

    test('isSymlink', async () => {
        const sourcePath = path.join(pathToTestDir, 'is-symlink-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-target.txt');

        await FileSystem.ensureFileExists(sourcePath);

        expect(await FileSystem.isSymlink(sourcePath)).toBe(false);
        expect(await FileSystem.isSymlink(symlinkPath)).toBe(false);
        await FileSystem.symlink(sourcePath, symlinkPath);
        expect(await FileSystem.isSymlink(symlinkPath)).toBe(true);
    });

    test('isSymlinkToDirectory', async () => {
        const sourcePath = path.join(pathToTestDir, 'is-symlink-to-directory-source');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-to-directory-target.txt');

        await FileSystem.ensureDirectoryExists(sourcePath);

        expect(await FileSystem.isSymlinkToDirectory(symlinkPath)).toBe(false);
        await FileSystem.symlink(sourcePath, symlinkPath);
        expect(await FileSystem.isSymlinkToDirectory(symlinkPath)).toBe(true);
    });

    test('readDirectory', async () => {
        const testPath = path.join(pathToTestDir, 'read-directory');

        await FileSystem.ensureDirectoryExists(testPath);

        for (const i of ['1', 'test', 'abc']) {
            await FileSystem.ensureFileExists(path.join(testPath, i));
        }

        expect(await FileSystem.readDirectory(testPath)).toContain('1');
        expect(await FileSystem.readDirectory(testPath)).toContain('test');
        expect(await FileSystem.readDirectory(testPath)).toContain('abc');
    });

    test('readFile', async () => {
        const testPath = path.join(pathToTestDir, 'read-file');

        await FileSystem.writeFile(testPath, 'read-file');
        expect(await FileSystem.readFile(testPath)).toBe('read-file');
    });

    test('remove', async () => {
        const testPath = path.join(pathToTestDir, 'remove');

        await FileSystem.ensureFileExists(testPath);
        expect(await FileSystem.isFile(testPath)).toBe(true);
        await FileSystem.remove(testPath);
        expect(await FileSystem.isFile(testPath)).toBe(false);
    });

    test('rename', async () => {
        const sourcePath = path.join(pathToTestDir, 'rename-source.txt');
        const targetPath = path.join(pathToTestDir, 'rename-target.txt');

        await FileSystem.ensureFileExists(sourcePath);
        await FileSystem.rename(sourcePath, targetPath);

        expect(await FileSystem.isFile(targetPath)).toBe(true);
    });

    test('symlink', async () => {
        const sourcePath = path.join(pathToTestDir, 'symlink-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'symlink-target.txt');

        await FileSystem.ensureFileExists(sourcePath);

        await FileSystem.symlink(sourcePath, symlinkPath);
        expect(await FileSystem.isSymlink(symlinkPath)).toBe(true);
    });

    test('writeFile', async () => {
        const testPath = path.join(pathToTestDir, 'write-file');

        await FileSystem.writeFile(testPath, 'write-file');
        expect(await FileSystem.readFile(testPath)).toBe('write-file');
    });
});
