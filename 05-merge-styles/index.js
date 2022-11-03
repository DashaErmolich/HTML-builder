const fsPromises = require ('fs/promises');
const { createReadStream } = require('fs')
const path = require('path');

const stylesFolderName = 'styles';
const targetFolderName = 'project-dist';

const stylesFolderPath = path.join(__dirname, stylesFolderName);
const targetFolderPath = path.join(__dirname, targetFolderName)

const bundleFileName = 'bundle';
const stylesExtension = '.css';

const encoding = 'utf-8';

createBundle(stylesFolderPath, stylesExtension);

async function createBundle(sourceFolder, fileExtension) {
    try {
        const sourceFolderItems = await readFolder(sourceFolder);
        await readFiles(sourceFolderItems, fileExtension, sourceFolder);
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

async function readFiles(folderItems, fileExtension, sourceFolder) {
    try {
        for (let i = 0; i < folderItems.length; i ++) {
            const item = folderItems[i];
            const itemExtension = getFileExtension(item.name);

            if (!item.isDirectory() && itemExtension === fileExtension) {
                const filePath = path.join(sourceFolder, item.name)
                const bundleFilePath = path.join(targetFolderPath, `${bundleFileName}${stylesExtension}`);

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