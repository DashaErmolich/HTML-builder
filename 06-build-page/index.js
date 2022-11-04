const fsPromises = require ('fs/promises');
const path = require('path');
const { createReadStream } = require('fs');

const projectFolderName = 'project-dist';
const stylesFolderName = 'styles';

const stylesName = 'style';
const stylesExtension = '.css';

const assetsFolderName = 'assets';

const encoding = 'utf-8';

buildPage();

async function buildPage() {
    const projectFolderPath = getPath(projectFolderName);
    await createDir(projectFolderPath);

    const stylesFolderPath = getPath(stylesFolderName);
    await createBundle(stylesFolderPath, stylesExtension, projectFolderPath, stylesName);

    const assetsPath = getPath(assetsFolderName);
    const copyOfAssetsPath = path.join(projectFolderPath, assetsFolderName);
    await copyDir(assetsPath, copyOfAssetsPath);
}


function getPath(name) {
    return path.join(__dirname, name);
}

async function createDir(folderPath) {
    try {
        await fsPromises.mkdir(folderPath, {recursive: true});
    } catch (error) {
        console.log(error.message);
    }
}


async function createBundle(sourceFolder, fileExtension, targetFolder, fileName) {
    try {
        const sourceFolderItems = await readFolder(sourceFolder);
        await readFiles(sourceFolderItems, fileExtension, sourceFolder, targetFolder, fileName);
    } catch (error) {
        console.log(error.message);
    }
}

async function readFolder(folderPath) {
    try {
        const folderItems = await fsPromises.readdir(folderPath, {withFileTypes: true});
        return folderItems;
    } catch (error) {
        console.log(error.message);
    }
}

async function readFiles(folderItems, fileExtension, sourceFolder, targetFolder, fileName) {
    try {
        for (let i = 0; i < folderItems.length; i ++) {
            const item = folderItems[i];
            const itemExtension = getFileExtension(item.name);

            if (!item.isDirectory() && itemExtension === fileExtension) {
                const filePath = path.join(sourceFolder, item.name)
                const bundleFilePath = path.join(targetFolder, `${fileName}${fileExtension}`);

                const fileReadStream = createReadStream(filePath, encoding);
                await fsPromises.appendFile(bundleFilePath, fileReadStream, encoding)
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

function getFileExtension(filename) {
    return path.extname(filename);
}

async function copyDir(source, target) {
    try {
        await fsPromises.mkdir(target, {recursive: true});
        const folderItems = await readFolder(source);
        await copyFolderFiles(folderItems, source, target);
    } catch (error) {
        console.log(error.message);
    }
}

async function readFolder(folderPath) {
    try {
        const folderItems = await fsPromises.readdir(folderPath, {withFileTypes: true});
        return folderItems;
    } catch (error) {
        console.log(error.message);
    }
}

async function copyFolderFiles(folderItems, source, target) {
    try {
        for (let i = 0; i < folderItems.length; i ++) {
            const item = folderItems[i];
            if (!item.isDirectory()) {
                const filePath = path.join(source, item.name);
                const copyOfFilePath = path.join(target, item.name);
                await fsPromises.copyFile(filePath, copyOfFilePath);
            } else {
                const folder = path.join(source, item.name)
                const copy = path.join(target, item.name);
                copyDir(folder, copy)
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function getInnerSource(item, from) {
    let items = await readFolder(path.join(source, item.name));
    await copyFolderFiles(items, source, target);
}