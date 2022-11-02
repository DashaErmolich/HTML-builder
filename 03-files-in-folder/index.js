const fs  = require('fs/promises');
const path = require('path');

const folderName = 'secret-folder';
const folderPath = path.join(__dirname, folderName);

printFilesInfo(folderPath)

async function printFilesInfo(pathToFolder) {
    try {
        const folderItems = await fs.readdir(pathToFolder, {withFileTypes: true});

        for (let i = 0; i < folderItems.length; i ++) {
            const item = folderItems[i];
            if (!item.isDirectory()) {
                const fileExtension = getFileExtension(item.name);
                const fileName = getFileName(item.name, fileExtension)
                const filePath = getFilePath(pathToFolder, item.name);
                const fileSize = await getFileSize(filePath);
                const fileInfo = getFileOutput(fileName, fileExtension, fileSize)
                console.log(fileInfo);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

function getFileExtension(filename) {
    return path.extname(filename);
}

function getFileName(filename, extension) {
    return path.basename(filename, extension);
}

function getFilePath(pathToFolder, filename) {
    return path.join(pathToFolder, filename);
}

async function getFileSize(pathToFile) {
    try {
        const fileStats = await fs.stat(pathToFile);
        return fileStats.size;
    } catch (error) {
        console.log(error.message);
    }
}

function getFileOutput(name, extension, size) {
    const firstExtChar = 1;
    const output = `${name} - ${extension.slice(firstExtChar)} - ${size}b`;
    return output;
}