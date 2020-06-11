import { FileSystemComponent } from '../index';
import path from 'path';

const pathToTestDir = path.join(__dirname, 'test');

beforeAll(async () => {
    await FileSystemComponent.remove(pathToTestDir);
    await FileSystemComponent.ensureDirectoryExists(pathToTestDir);
    expect(await FileSystemComponent.isDirectory(pathToTestDir)).toBe(true);
});

afterAll(async () => {
    await FileSystemComponent.remove(pathToTestDir);
    expect(await FileSystemComponent.isDirectory(pathToTestDir)).toBe(false);
});

describe('FileSystemComponent', () => {
    test('appendFile', async () => {
        const testPath = path.join(pathToTestDir, 'append-file');

        await FileSystemComponent.appendFile(testPath, 'append-file');
        expect(await FileSystemComponent.readFile(testPath)).toBe('append-file');
        await FileSystemComponent.appendFile(testPath, '-append-file');
        expect(await FileSystemComponent.readFile(testPath)).toBe('append-file-append-file');
    });

    test('appendFileSync', () => {
        const testPath = path.join(pathToTestDir, 'append-file-sync');

        FileSystemComponent.appendFileSync(testPath, 'append-file-sync');
        expect(FileSystemComponent.readFileSync(testPath)).toBe('append-file-sync');
        FileSystemComponent.appendFileSync(testPath, '-append-file-sync');
        expect(FileSystemComponent.readFileSync(testPath)).toBe('append-file-sync-append-file-sync');
    });

    test('copyFile', async () => {
        const testSrc = path.join(pathToTestDir, 'copy-file-src');
        const testDest = path.join(pathToTestDir, 'copy-file-dest');

        await FileSystemComponent.ensureFileExists(testSrc);
        await FileSystemComponent.copyFile(testSrc, testDest);

        expect(await FileSystemComponent.isFile(testDest)).toBe(true);
    });

    test('copyFileSync', async () => {
        const testSrc = path.join(pathToTestDir, 'copy-file-sync-src');
        const testDest = path.join(pathToTestDir, 'copy-file-sync-dest');

        FileSystemComponent.ensureFileExistsSync(testSrc);
        FileSystemComponent.copyFileSync(testSrc, testDest);

        expect(FileSystemComponent.isFileSync(testDest)).toBe(true);
    });

    test('createWriteStream', async () => {
        const testPath = path.join(pathToTestDir, 'create-write-stream');

        const file = FileSystemComponent.createWriteStream(testPath);

        file.write('hello');
        file.end();

        expect(await FileSystemComponent.readFile(testPath)).toBe('hello');
    });

    test('ensureDirectoryExists', async () => {
        const testPath = path.join(pathToTestDir, 'ensure-directory-exists');

        await FileSystemComponent.ensureDirectoryExists(testPath);
        expect(await FileSystemComponent.isDirectory(testPath)).toBe(true);
    });

    test('ensureDirectoryExistsSync', () => {
        const testPath = path.join(pathToTestDir, 'ensure-directory-exists-sync');

        FileSystemComponent.ensureDirectoryExistsSync(testPath);
        expect(FileSystemComponent.isDirectorySync(testPath)).toBe(true);
    });

    test('ensureFileExists', async () => {
        const testPath = path.join(pathToTestDir, 'ensure-file-exists.txt');

        await FileSystemComponent.ensureFileExists(testPath);
        expect(await FileSystemComponent.isFile(testPath)).toBe(true);
    });

    test('ensureFileExistsSync', () => {
        const testPath = path.join(pathToTestDir, 'ensure-file-exists-sync.txt');

        FileSystemComponent.ensureFileExistsSync(testPath);
        expect(FileSystemComponent.isFileSync(testPath)).toBe(true);
    });

    test('isDirectory', async () => {
        const testPath = path.join(pathToTestDir, 'is-directory');

        expect(await FileSystemComponent.isDirectory(testPath)).toBe(false);
        await FileSystemComponent.ensureDirectoryExists(testPath);
        expect(await FileSystemComponent.isDirectory(testPath)).toBe(true);
    });

    test('isDirectorySnc', () => {
        const testPath = path.join(pathToTestDir, 'is-directory-sync');

        expect(FileSystemComponent.isDirectorySync(testPath)).toBe(false);
        FileSystemComponent.ensureDirectoryExistsSync(testPath);
        expect(FileSystemComponent.isDirectorySync(testPath)).toBe(true);
    });

    test('isFile', async () => {
        const testPath = path.join(pathToTestDir, 'is-file');

        expect(await FileSystemComponent.isFile(testPath)).toBe(false);
        await FileSystemComponent.ensureFileExists(testPath);
        expect(await FileSystemComponent.isFile(testPath)).toBe(true);
    });

    test('isFileSync', () => {
        const testPath = path.join(pathToTestDir, 'is-file-sync');

        expect(FileSystemComponent.isFileSync(testPath)).toBe(false);
        FileSystemComponent.ensureFileExistsSync(testPath);
        expect(FileSystemComponent.isFileSync(testPath)).toBe(true);
    });

    test('isSymlink', async () => {
        const sourcePath = path.join(pathToTestDir, 'is-symlink-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-target.txt');

        await FileSystemComponent.ensureFileExists(sourcePath);

        expect(await FileSystemComponent.isSymlink(sourcePath)).toBe(false);
        expect(await FileSystemComponent.isSymlink(symlinkPath)).toBe(false);
        await FileSystemComponent.symlink(sourcePath, symlinkPath);
        expect(await FileSystemComponent.isSymlink(symlinkPath)).toBe(true);
    });

    test('isSymlinkSync', () => {
        const sourcePath = path.join(pathToTestDir, 'is-symlink-sync-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-sync-target.txt');

        FileSystemComponent.ensureFileExistsSync(sourcePath);

        expect(FileSystemComponent.isSymlinkSync(sourcePath)).toBe(false);
        expect(FileSystemComponent.isSymlinkSync(symlinkPath)).toBe(false);
        FileSystemComponent.symlinkSync(sourcePath, symlinkPath);
        expect(FileSystemComponent.isSymlinkSync(symlinkPath)).toBe(true);
    });

    test('isSymlinkToDirectory', async () => {
        const sourcePath = path.join(pathToTestDir, 'is-symlink-to-directory-source');
        const symlinkPath = path.join(pathToTestDir, 'is-symlink-to-directory-target.txt');

        await FileSystemComponent.ensureDirectoryExists(sourcePath);

        expect(await FileSystemComponent.isSymlinkToDirectory(symlinkPath)).toBe(false);
        await FileSystemComponent.symlink(sourcePath, symlinkPath);
        expect(await FileSystemComponent.isSymlinkToDirectory(symlinkPath)).toBe(true);
    });

    test('readDirectory', async () => {
        const testPath = path.join(pathToTestDir, 'read-directory');

        await FileSystemComponent.ensureDirectoryExists(testPath);

        for (const i of ['1', 'test', 'abc']) {
            await FileSystemComponent.ensureFileExists(path.join(testPath, i));
        }

        expect(await FileSystemComponent.readDirectory(testPath)).toContain('1');
        expect(await FileSystemComponent.readDirectory(testPath)).toContain('test');
        expect(await FileSystemComponent.readDirectory(testPath)).toContain('abc');
    });

    test('readFile', async () => {
        const testPath = path.join(pathToTestDir, 'read-file');

        await FileSystemComponent.writeFile(testPath, 'read-file');
        expect(await FileSystemComponent.readFile(testPath)).toBe('read-file');
    });

    test('readFileSync', () => {
        const testPath = path.join(pathToTestDir, 'read-file-sync');

        FileSystemComponent.writeFileSync(testPath, 'read-file-sync');
        expect(FileSystemComponent.readFileSync(testPath)).toBe('read-file-sync');
    });

    test('remove', async () => {
        const testDirectory = path.join(pathToTestDir, 'remove');
        const testFile = path.join(testDirectory, 'remove-sub/remove-test-file');
        const testFileSymlink = path.join(testDirectory, 'remove-sub/remove-test-file-symlink');
        const notExistingTestFile = '';

        await FileSystemComponent.ensureFileExists(testFile);
        await FileSystemComponent.symlink(testFile, testFileSymlink);
        expect(await FileSystemComponent.isFile(testFile)).toBe(true);
        await FileSystemComponent.remove(testDirectory);
        await FileSystemComponent.remove(notExistingTestFile);
        expect(await FileSystemComponent.isFile(testFile)).toBe(false);
    });

    test('removeSync', () => {
        const testDirectory = path.join(pathToTestDir, 'remove-sync');
        const testFile = path.join(testDirectory, 'remove-sub/remove-test-file');
        const testFileSymlink = path.join(testDirectory, 'remove-sub/remove-test-file-symlink');
        const notExistingTestFile = '';

        FileSystemComponent.ensureFileExistsSync(testFile);
        FileSystemComponent.symlinkSync(testFile, testFileSymlink);
        expect(FileSystemComponent.isFileSync(testFile)).toBe(true);
        FileSystemComponent.removeSync(testDirectory);
        FileSystemComponent.removeSync(notExistingTestFile);
        expect(FileSystemComponent.isFileSync(testFile)).toBe(false);
    });

    test('rename', async () => {
        const sourcePath = path.join(pathToTestDir, 'rename-source.txt');
        const targetPath = path.join(pathToTestDir, 'rename-target.txt');

        await FileSystemComponent.ensureFileExists(sourcePath);
        await FileSystemComponent.rename(sourcePath, targetPath);

        expect(await FileSystemComponent.isFile(targetPath)).toBe(true);
    });

    test('symlink', async () => {
        const sourcePath = path.join(pathToTestDir, 'symlink-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'symlink-target.txt');

        await FileSystemComponent.ensureFileExists(sourcePath);

        await FileSystemComponent.symlink(sourcePath, symlinkPath);
        expect(await FileSystemComponent.isSymlink(symlinkPath)).toBe(true);
    });

    test('symlinkSync', () => {
        const sourcePath = path.join(pathToTestDir, 'symlink-sync-source.txt');
        const symlinkPath = path.join(pathToTestDir, 'symlink-sync-target.txt');

        FileSystemComponent.ensureFileExistsSync(sourcePath);

        FileSystemComponent.symlinkSync(sourcePath, symlinkPath);
        expect(FileSystemComponent.isSymlinkSync(symlinkPath)).toBe(true);
    });

    test('writeFile', async () => {
        const testPath = path.join(pathToTestDir, 'write-file');

        await FileSystemComponent.writeFile(testPath, 'write-file');
        expect(await FileSystemComponent.readFile(testPath)).toBe('write-file');
    });

    test('writeFileSync', () => {
        const testPath = path.join(pathToTestDir, 'write-file-sync');

        FileSystemComponent.writeFileSync(testPath, 'write-file-sync');
        expect(FileSystemComponent.readFileSync(testPath)).toBe('write-file-sync');
    });
});
