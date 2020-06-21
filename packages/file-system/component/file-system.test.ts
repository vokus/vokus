import { FileSystem } from '../index';
import { ObjectManager } from '@vokus/dependency-injection';
import path from 'path';

const pathToTestDir = path.join(__dirname, 'test');

beforeAll(async () => {
    const fileSystem: FileSystem = await ObjectManager.get(FileSystem);

    await fileSystem.remove(pathToTestDir);
    await fileSystem.ensureDirectoryExists(pathToTestDir);
    expect(await fileSystem.isDirectory(pathToTestDir)).toBe(true);
});

afterAll(async () => {
    const fileSystem: FileSystem = await ObjectManager.get(FileSystem);

    await fileSystem.remove(pathToTestDir);
    expect(await fileSystem.isDirectory(pathToTestDir)).toBe(false);
});

describe('FileSystem', () => {
    test('appendFile', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'append-file');

        await fileSystem.appendFile(testPath, 'append-file');
        expect(await fileSystem.readFile(testPath)).toBe('append-file');
        await fileSystem.appendFile(testPath, '-append-file');
        expect(await fileSystem.readFile(testPath)).toBe('append-file-append-file');
    });

    test('appendFileSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'append-file-sync');

        fileSystem.appendFileSync(testPath, 'append-file-sync');
        expect(fileSystem.readFileSync(testPath)).toBe('append-file-sync');
        fileSystem.appendFileSync(testPath, '-append-file-sync');
        expect(fileSystem.readFileSync(testPath)).toBe('append-file-sync-append-file-sync');
    });

    test('copyFile', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testSrc = path.join(pathToTestDir, 'copy-file-src');
        const testDest = path.join(pathToTestDir, 'copy-file-dest');

        await fileSystem.ensureFileExists(testSrc);
        await fileSystem.copyFile(testSrc, testDest);

        expect(await fileSystem.isFile(testDest)).toBe(true);
    });

    test('copyFileSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testSrc = path.join(pathToTestDir, 'copy-file-sync-src');
        const testDest = path.join(pathToTestDir, 'copy-file-sync-dest');

        fileSystem.ensureFileExistsSync(testSrc);
        fileSystem.copyFileSync(testSrc, testDest);

        expect(fileSystem.isFileSync(testDest)).toBe(true);
    });

    test('createWriteStream', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'create-write-stream');
        const file = fileSystem.createWriteStream(testPath);

        file.write('hello');
        file.end();

        expect(await fileSystem.readFile(testPath)).toBe('hello');
    });

    test('ensureDirectoryExists', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'ensure-directory-exists');

        await fileSystem.ensureDirectoryExists(testPath);
        expect(await fileSystem.isDirectory(testPath)).toBe(true);
    });

    test('ensureDirectoryExistsSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'ensure-directory-exists-sync');

        fileSystem.ensureDirectoryExistsSync(testPath);
        expect(fileSystem.isDirectorySync(testPath)).toBe(true);
    });

    test('ensureFileExists', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'ensure-file-exists.txt');

        await fileSystem.ensureFileExists(testPath);
        expect(await fileSystem.isFile(testPath)).toBe(true);
    });

    test('ensureFileExistsSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'ensure-file-exists-sync.txt');

        fileSystem.ensureFileExistsSync(testPath);
        expect(fileSystem.isFileSync(testPath)).toBe(true);
    });

    test('isDirectory', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'is-directory');

        expect(await fileSystem.isDirectory(testPath)).toBe(false);
        await fileSystem.ensureDirectoryExists(testPath);
        expect(await fileSystem.isDirectory(testPath)).toBe(true);
    });

    test('isDirectorySnc', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'is-directory-sync');

        expect(fileSystem.isDirectorySync(testPath)).toBe(false);
        fileSystem.ensureDirectoryExistsSync(testPath);
        expect(fileSystem.isDirectorySync(testPath)).toBe(true);
    });

    test('isFile', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'is-file');

        expect(await fileSystem.isFile(testPath)).toBe(false);
        await fileSystem.ensureFileExists(testPath);
        expect(await fileSystem.isFile(testPath)).toBe(true);
    });

    test('isFileSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'is-file-sync');

        expect(fileSystem.isFileSync(testPath)).toBe(false);
        fileSystem.ensureFileExistsSync(testPath);
        expect(fileSystem.isFileSync(testPath)).toBe(true);
    });

    test('isSymlink', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const sourcePath = path.join(pathToTestDir, 'is-symlink-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-target.txt');

        await fileSystem.ensureFileExists(sourcePath);

        expect(await fileSystem.isSymlink(sourcePath)).toBe(false);
        expect(await fileSystem.isSymlink(symlinkPath)).toBe(false);
        await fileSystem.symlink(sourcePath, symlinkPath);
        expect(await fileSystem.isSymlink(symlinkPath)).toBe(true);
    });

    test('isSymlinkSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const sourcePath = path.join(pathToTestDir, 'is-symlink-sync-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-sync-target.txt');

        fileSystem.ensureFileExistsSync(sourcePath);

        expect(fileSystem.isSymlinkSync(sourcePath)).toBe(false);
        expect(fileSystem.isSymlinkSync(symlinkPath)).toBe(false);
        fileSystem.symlinkSync(sourcePath, symlinkPath);
        expect(fileSystem.isSymlinkSync(symlinkPath)).toBe(true);
    });

    test('isSymlinkToDirectory', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const sourcePath = path.join(pathToTestDir, 'is-symlink-to-directory-source');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-to-directory-target.txt');

        await fileSystem.ensureDirectoryExists(sourcePath);

        expect(await fileSystem.isSymlinkToDirectory(symlinkPath)).toBe(false);
        await fileSystem.symlink(sourcePath, symlinkPath);
        expect(await fileSystem.isSymlinkToDirectory(symlinkPath)).toBe(true);
    });

    test('readDirectory', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'read-directory');

        await fileSystem.ensureDirectoryExists(testPath);

        for (const i of ['1', 'test', 'abc']) {
            await fileSystem.ensureFileExists(path.join(testPath, i));
        }

        expect(await fileSystem.readDirectory(testPath)).toContain('1');
        expect(await fileSystem.readDirectory(testPath)).toContain('test');
        expect(await fileSystem.readDirectory(testPath)).toContain('abc');
    });

    test('readFile', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'read-file');

        await fileSystem.writeFile(testPath, 'read-file');
        expect(await fileSystem.readFile(testPath)).toBe('read-file');
    });

    test('readFileSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'read-file-sync');

        fileSystem.writeFileSync(testPath, 'read-file-sync');
        expect(fileSystem.readFileSync(testPath)).toBe('read-file-sync');
    });

    test('remove', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testDirectory = path.join(pathToTestDir, 'remove');
        const testFile = path.join(testDirectory, 'remove-sub/remove-test-file');
        const testFileSymlink = path.join(testDirectory, 'remove-sub/remove-test-file-symlink');
        const notExistingTestFile = '';

        await fileSystem.ensureFileExists(testFile);
        await fileSystem.symlink(testFile, testFileSymlink);
        expect(await fileSystem.isFile(testFile)).toBe(true);
        await fileSystem.remove(testDirectory);
        await fileSystem.remove(notExistingTestFile);
        expect(await fileSystem.isFile(testFile)).toBe(false);
    });

    test('removeSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testDirectory = path.join(pathToTestDir, 'remove-sync');
        const testFile = path.join(testDirectory, 'remove-sub/remove-test-file');
        const testFileSymlink = path.join(testDirectory, 'remove-sub/remove-test-file-symlink');
        const notExistingTestFile = '';

        fileSystem.ensureFileExistsSync(testFile);
        fileSystem.symlinkSync(testFile, testFileSymlink);
        expect(fileSystem.isFileSync(testFile)).toBe(true);
        fileSystem.removeSync(testDirectory);
        fileSystem.removeSync(notExistingTestFile);
        expect(fileSystem.isFileSync(testFile)).toBe(false);
    });

    test('rename', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const sourcePath = path.join(pathToTestDir, 'rename-source.txt');
        const targetPath = path.join(pathToTestDir, 'rename-target.txt');

        await fileSystem.ensureFileExists(sourcePath);
        await fileSystem.rename(sourcePath, targetPath);

        expect(await fileSystem.isFile(targetPath)).toBe(true);
    });

    test('symlink', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const sourcePath = path.join(pathToTestDir, 'symlink-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'symlink-target.txt');

        await fileSystem.ensureFileExists(sourcePath);

        await fileSystem.symlink(sourcePath, symlinkPath);
        expect(await fileSystem.isSymlink(symlinkPath)).toBe(true);
    });

    test('symlinkSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const sourcePath = path.join(pathToTestDir, 'symlink-sync-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'symlink-sync-target.txt');

        fileSystem.ensureFileExistsSync(sourcePath);

        fileSystem.symlinkSync(sourcePath, symlinkPath);
        expect(fileSystem.isSymlinkSync(symlinkPath)).toBe(true);
    });

    test('writeFile', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'write-file');

        await fileSystem.writeFile(testPath, 'write-file');
        expect(await fileSystem.readFile(testPath)).toBe('write-file');
    });

    test('writeFileSync', async () => {
        const fileSystem: FileSystem = await ObjectManager.get(FileSystem);
        const testPath = path.join(pathToTestDir, 'write-file-sync');

        fileSystem.writeFileSync(testPath, 'write-file-sync');
        expect(fileSystem.readFileSync(testPath)).toBe('write-file-sync');
    });
});
