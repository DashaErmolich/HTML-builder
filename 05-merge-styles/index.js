const fsPromises = require ('fs/promises');
const { createReadStream, createWriteStream } = require('fs')
const path = require('path');

const stylesFolderName = 'styles';
const targetFolderName = 'project-dist';

const stylesFolderPath = path.join(__dirname, stylesFolderName);
const targetFolderPath = path.join(__dirname, targetFolderName)

const bundleFileName = 'bundle';
const stylesExtension = '.css';

const encoding = 'utf-8';

createBundle(stylesFolderPath, stylesExtension, targetFolderPath, bundleFileName);

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
        const tmpBundlePath = path.join(targetFolder, `tmp${fileExtension}`);

        for (let i = 0; i < folderItems.length; i ++) {
            const item = folderItems[i];
            const itemExtension = getFileExtension(item.name);

            if (!item.isDirectory() && itemExtension === fileExtension) {
                const filePath = path.join(sourceFolder, item.name)
                const fileReadStream = createReadStream(filePath, encoding);
                await fsPromises.appendFile(tmpBundlePath, '\n', encoding);
                await fsPromises.appendFile(tmpBundlePath, fileReadStream, encoding)
            }
        }

        const bundleFilePath = path.join(targetFolder, `${fileName}${fileExtension}`);
        const tmpReadStream = createReadStream(tmpBundlePath, encoding)
        const bundleWriteStream = createWriteStream(bundleFilePath, encoding);
        tmpReadStream.pipe(bundleWriteStream);
        tmpReadStream.on('end', () => {
            fsPromises.unlink(tmpBundlePath);
        })
        
    } catch (error) {
        console.log(error.message);
    }
}

function getFileExtension(filename) {
    return path.extname(filename);
}