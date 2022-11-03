const fsPromises = require ('fs/promises');
const path = require('path');

const folderName = 'files';
const folderPath = path.join(__dirname, folderName);

const copyOfFolderName = 'files-copy';
const copyOfFolderPath = path.join(__dirname, copyOfFolderName);

copyDir(folderPath, copyOfFolderPath);

async function copyDir(source, target) {
    try {
        const createDir = await fsPromises.mkdir(target, {recursive: true});
        const folderItems = await readFolder(source);
        await copyFolderFiles(folderItems);
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

async function copyFolderFiles(folderItems) {
    try {
        for (let i = 0; i < folderItems.length; i ++) {
            const item = folderItems[i];
            if (!item.isDirectory()) {
                const filePath = path.join(folderPath, item.name);
                const copyOfFilePath = path.join(copyOfFolderPath, item.name);
                await fsPromises.copyFile(filePath, copyOfFilePath);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}