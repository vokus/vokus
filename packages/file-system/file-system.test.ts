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

describe('file-system', () => {
    test('appendFile', async () => {
        const testPath = path.join(pathToTestDir, 'append-file');

        await FileSystem.appendFile(testPath, 'append-file');
        expect(await FileSystem.readFile(testPath)).toBe('append-file');
        await FileSystem.appendFile(testPath, '-append-file');
        expect(await FileSystem.readFile(testPath)).toBe('append-file-append-file');
    });

    test('appendFileSync', () => {
        const testPath = path.join(pathToTestDir, 'append-file-sync');

        FileSystem.appendFileSync(testPath, 'append-file-sync');
        expect(FileSystem.readFileSync(testPath)).toBe('append-file-sync');
        FileSystem.appendFileSync(testPath, '-append-file-sync');
        expect(FileSystem.readFileSync(testPath)).toBe('append-file-sync-append-file-sync');
    });

    test('copyFile', async () => {
        const testSrc = path.join(pathToTestDir, 'copy-file-src');
        const testDest = path.join(pathToTestDir, 'copy-file-dest');

        await FileSystem.ensureFileExists(testSrc);
        await FileSystem.copyFile(testSrc, testDest);

        expect(await FileSystem.isFile(testDest)).toBe(true);
    });

    test('copyFileSync', () => {
        const testSrc = path.join(pathToTestDir, 'copy-file-sync-src');
        const testDest = path.join(pathToTestDir, 'copy-file-sync-dest');

        FileSystem.ensureFileExistsSync(testSrc);
        FileSystem.copyFileSync(testSrc, testDest);

        expect(FileSystem.isFileSync(testDest)).toBe(true);
    });

    test('ensureDirectoryExists', async () => {
        const testPath = path.join(pathToTestDir, 'ensure-directory-exists');

        await FileSystem.ensureDirectoryExists(testPath);
        expect(await FileSystem.isDirectory(testPath)).toBe(true);
    });

    test('ensureDirectoryExistsSync', () => {
        const testPath = path.join(pathToTestDir, 'ensure-directory-exists-sync');

        FileSystem.ensureDirectoryExistsSync(testPath);
        expect(FileSystem.isDirectorySync(testPath)).toBe(true);
    });

    test('ensureFileExists', async () => {
        const testPath = path.join(pathToTestDir, 'ensure-file-exists.txt');

        await FileSystem.ensureFileExists(testPath);
        expect(await FileSystem.isFile(testPath)).toBe(true);
    });

    test('ensureFileExistsSync', () => {
        const testPath = path.join(pathToTestDir, 'ensure-file-exists-sync.txt');

        FileSystem.ensureFileExistsSync(testPath);
        expect(FileSystem.isFileSync(testPath)).toBe(true);
    });

    test('isDirectory', async () => {
        const testPath = path.join(pathToTestDir, 'is-directory');

        expect(await FileSystem.isDirectory(testPath)).toBe(false);
        await FileSystem.ensureDirectoryExists(testPath);
        expect(await FileSystem.isDirectory(testPath)).toBe(true);
    });

    test('isDirectorySnc', () => {
        const testPath = path.join(pathToTestDir, 'is-directory-sync');

        expect(FileSystem.isDirectorySync(testPath)).toBe(false);
        FileSystem.ensureDirectoryExistsSync(testPath);
        expect(FileSystem.isDirectorySync(testPath)).toBe(true);
    });

    test('isFile', async () => {
        const testPath = path.join(pathToTestDir, 'is-file');

        expect(await FileSystem.isFile(testPath)).toBe(false);
        await FileSystem.ensureFileExists(testPath);
        expect(await FileSystem.isFile(testPath)).toBe(true);
    });

    test('isFileSync', () => {
        const testPath = path.join(pathToTestDir, 'is-file-sync');

        expect(FileSystem.isFileSync(testPath)).toBe(false);
        FileSystem.ensureFileExistsSync(testPath);
        expect(FileSystem.isFileSync(testPath)).toBe(true);
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

    test('isSymlinkSync', () => {
        const sourcePath = path.join(pathToTestDir, 'is-symlink-sync-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-sync-target.txt');

        FileSystem.ensureFileExistsSync(sourcePath);

        expect(FileSystem.isSymlinkSync(sourcePath)).toBe(false);
        expect(FileSystem.isSymlinkSync(symlinkPath)).toBe(false);
        FileSystem.symlinkSync(sourcePath, symlinkPath);
        expect(FileSystem.isSymlinkSync(symlinkPath)).toBe(true);
    });

    test('isSymlinkToDirectory', async () => {
        const sourcePath = path.join(pathToTestDir, 'is-symlink-to-directory-source');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-to-directory-target.txt');

        await FileSystem.ensureDirectoryExists(sourcePath);

        expect(await FileSystem.isSymlinkToDirectory(symlinkPath)).toBe(false);
        await FileSystem.symlink(sourcePath, symlinkPath);
        expect(await FileSystem.isSymlinkToDirectory(symlinkPath)).toBe(true);
    });

    test('listFiles', async () => {
        const sourcePath = path.join(pathToTestDir, '/list-files/');

        const path1 = path.join(sourcePath, 'test.test');
        const path2 = path.join(sourcePath, 'test', 'test1.test');
        const path3 = path.join(sourcePath, 'test', 'test2.test');

        await FileSystem.ensureFileExists(path1);
        await FileSystem.ensureFileExists(path2);
        await FileSystem.ensureFileExists(path3);

        await FileSystem.ensureDirectoryExists(sourcePath);

        expect((await FileSystem.listFiles(sourcePath)).length).toBe(3);
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

    test('readFileSync', () => {
        const testPath = path.join(pathToTestDir, 'read-file-sync');

        FileSystem.writeFileSync(testPath, 'read-file-sync');
        expect(FileSystem.readFileSync(testPath)).toBe('read-file-sync');
    });

    test('remove', async () => {
        const testDirectory = path.join(pathToTestDir, 'remove');
        const testFile = path.join(testDirectory, 'remove-sub/remove-test-file');
        const testFileSymlink = path.join(testDirectory, 'remove-sub/remove-test-file-symlink');
        const notExistingTestFile = '';

        await FileSystem.ensureFileExists(testFile);
        await FileSystem.symlink(testFile, testFileSymlink);
        expect(await FileSystem.isFile(testFile)).toBe(true);
        await FileSystem.remove(testDirectory);
        await FileSystem.remove(notExistingTestFile);
        expect(await FileSystem.isFile(testFile)).toBe(false);
    });

    test('removeSync', () => {
        const testDirectory = path.join(pathToTestDir, 'remove-sync');
        const testFile = path.join(testDirectory, 'remove-sub/remove-test-file');
        const testFileSymlink = path.join(testDirectory, 'remove-sub/remove-test-file-symlink');
        const notExistingTestFile = '';

        FileSystem.ensureFileExistsSync(testFile);
        FileSystem.symlinkSync(testFile, testFileSymlink);
        expect(FileSystem.isFileSync(testFile)).toBe(true);
        FileSystem.removeSync(testDirectory);
        FileSystem.removeSync(notExistingTestFile);
        expect(FileSystem.isFileSync(testFile)).toBe(false);
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

    test('symlinkSync', () => {
        const sourcePath = path.join(pathToTestDir, 'symlink-sync-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'symlink-sync-target.txt');

        FileSystem.ensureFileExistsSync(sourcePath);

        FileSystem.symlinkSync(sourcePath, symlinkPath);
        expect(FileSystem.isSymlinkSync(symlinkPath)).toBe(true);
    });

    test('writeFile', async () => {
        const testPath = path.join(pathToTestDir, 'write-file');

        await FileSystem.writeFile(testPath, 'write-file');
        expect(await FileSystem.readFile(testPath)).toBe('write-file');
    });

    test('writeFileSync', () => {
        const testPath = path.join(pathToTestDir, 'write-file-sync');

        FileSystem.writeFileSync(testPath, 'write-file-sync');
        expect(FileSystem.readFileSync(testPath)).toBe('write-file-sync');
    });
});
