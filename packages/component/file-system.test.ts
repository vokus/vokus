import FileSystem from './file-system';
import path from 'path';

const pathToTest = path.join(process.cwd(), 'var/', 'test/');
const testDir1 = 'file-system-1';
const testDir2 = 'file-system-2';
const pathToTestDir1 = path.join(pathToTest, testDir1, '/');
const pathToTestDir2 = path.join(pathToTest, testDir2, '/');
const testFile1 = 'test-file-1.txt';
const testFile2 = 'test-file-2.txt';
const pathToTestFile1 = path.join(pathToTestDir1, testFile1);
const pathToTestFile2 = path.join(pathToTestDir2, testFile2);
const testString = 'test-string';

test('file-system', async () => {
    // isDirectory
    expect(await FileSystem.isDirectory(pathToTestDir1)).toBe(false);
    expect(FileSystem.isDirectorySync(pathToTestDir1)).toBe(false);

    // ensureDirExists
    await FileSystem.ensureDirExists(pathToTestDir1);
    FileSystem.ensureDirExistsSync(pathToTestDir2);

    // isDirectory
    expect(await FileSystem.isDirectory(pathToTestDir1)).toBe(true);
    expect(FileSystem.isDirectorySync(pathToTestDir2)).toBe(true);

    // ensureFileExists
    await FileSystem.ensureFileExists(pathToTestFile2);

    // symlink file
    await FileSystem.symlink(
        path.join('../', testDir2, testFile2),
        pathToTestFile1,
    );

    // isSymlink
    expect(await FileSystem.isSymlink(pathToTestDir1)).toBe(false);
    expect(FileSystem.isSymlinkSync(pathToTestDir1)).toBe(false);
    expect(await FileSystem.isSymlink(pathToTestFile1)).toBe(true);
    expect(FileSystem.isSymlinkSync(pathToTestFile1)).toBe(true);
    expect(await FileSystem.isSymlink(pathToTestFile2)).toBe(false);
    expect(FileSystem.isSymlinkSync(pathToTestFile2)).toBe(false);

    // remove
    await FileSystem.remove(pathToTestDir1);
    FileSystem.removeSync(pathToTestDir2);
    FileSystem.removeSync(pathToTestDir2);

    // ensureDirExists
    await FileSystem.ensureDirExists(pathToTestDir2);

    // symlink dir
    await FileSystem.symlink(pathToTestDir2, path.join(pathToTest, testDir1));

    // isSymlink to dir
    expect(await FileSystem.isSymlinkToDirectory(pathToTestDir2)).toBe(false);
    expect(
        await FileSystem.isSymlinkToDirectory(path.join(pathToTest, testDir1)),
    ).toBe(true);
    expect(await FileSystem.isSymlinkToDirectory(pathToTestFile1)).toBe(false);

    // remove pathToVar
    await FileSystem.remove(pathToTest);

    // ensureDirExists
    await FileSystem.ensureDirExists(pathToTestDir1);
    await FileSystem.ensureDirExists(pathToTestDir2);

    // ensureFileExistsSync
    FileSystem.ensureFileExistsSync(pathToTestFile1);

    // isFile
    expect(await FileSystem.isFile(pathToTestFile1)).toBe(true);
    expect(FileSystem.isFileSync(pathToTestFile1)).toBe(true);

    // remove
    await FileSystem.remove(pathToTestFile1);

    // isFile
    expect(await FileSystem.isFile(pathToTestFile1)).toBe(false);
    expect(FileSystem.isFileSync(pathToTestFile1)).toBe(false);

    // ensureFileExists
    await FileSystem.ensureFileExists(pathToTestFile1);

    // appendFile
    await FileSystem.appendFile(pathToTestFile1, testString);

    // readFile
    expect(await FileSystem.readFile(pathToTestFile1)).toBe(testString);
    expect(FileSystem.readFileSync(pathToTestFile1)).toBe(testString);

    // rename
    await FileSystem.rename(pathToTestFile1, pathToTestFile2);

    // isFile
    expect(await FileSystem.isFile(pathToTestFile1)).toBe(false);
    expect(FileSystem.isFileSync(pathToTestFile1)).toBe(false);
    expect(await FileSystem.isFile(pathToTestFile2)).toBe(true);
    expect(FileSystem.isFileSync(pathToTestFile2)).toBe(true);

    // readDir
    expect((await FileSystem.readDirectory(pathToTestDir1)).length).toBe(0);
    expect((await FileSystem.readDirectory(pathToTestDir2)).length).toBe(1);

    // remove pathToVar
    await FileSystem.remove(pathToTest);
    await FileSystem.remove(pathToTest);

    // isSymlink on not existing dir
    expect(await FileSystem.isSymlink(pathToTest)).toBe(false);
    expect(FileSystem.isSymlinkSync(pathToTest)).toBe(false);
});
