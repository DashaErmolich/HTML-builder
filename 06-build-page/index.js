const fsPromises = require ('fs/promises');
const path = require('path');
const { createReadStream } = require('fs');

const projectFolderName = 'project-dist';
const stylesFolderName = 'styles';

stylesName = 'style';
const stylesExtension = '.css';

const encoding = 'utf-8';

buildPage();

async function buildPage() {
    const projectFolderPath = getPath(projectFolderName);
    await createDir(projectFolderPath);

    const stylesFolderPath = getPath(stylesFolderName);
    await createBundle(stylesFolderPath, stylesExtension, projectFolderPath, stylesName);
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