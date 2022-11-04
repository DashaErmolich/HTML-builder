const fsPromises = require ('fs/promises');
const path = require('path');
const { createReadStream, createWriteStream } = require('fs');

const projectFolderName = 'project-dist';
const stylesFolderName = 'styles';
const htmlComponentsFolderName = 'components';

const stylesName = 'style';
const stylesExtension = '.css';

const htmlName = 'index';
const htmlExtension = '.html';
const htmlTemplateName = 'template';

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

    const htmlComponentsFolderPath = getPath(htmlComponentsFolderName);
    const htmlTemplatePath = getPath(`${htmlTemplateName}${htmlExtension}`);
    const htmlPage = await createPage(htmlTemplatePath, htmlComponentsFolderPath, htmlExtension);
    const htmlPath = path.join(projectFolderPath, `${htmlName}${htmlExtension}`)
    const htmlWriteStream = createWriteStream(htmlPath, encoding);
    htmlWriteStream.write(htmlPage);
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
        const tmpBundlePath = path.join(targetFolder, `tmp${fileExtension}`);
        
        for (let i = 0; i < folderItems.length; i ++) {
            const item = folderItems[i];
            const itemExtension = getFileExtension(item.name);

            if (!item.isDirectory() && itemExtension === fileExtension) {
                const filePath = path.join(sourceFolder, item.name);
                const fileReadStream = createReadStream(filePath, encoding);
                await fsPromises.appendFile(tmpBundlePath, '\n', encoding);
                await fsPromises.appendFile(tmpBundlePath, fileReadStream, encoding);
            }
        }

        const bundleFilePath = path.join(targetFolder, `${fileName}${fileExtension}`);
        const tmpReadStream = createReadStream(tmpBundlePath, encoding)
        const bundleWriteStream = createWriteStream(bundleFilePath, encoding);
        tmpReadStream.pipe(bundleWriteStream);
        await fsPromises.unlink(tmpBundlePath);
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
                const innerFolderPath = path.join(source, item.name)
                const copyOfInnerFolderPath = path.join(target, item.name);
                copyDir(innerFolderPath, copyOfInnerFolderPath)
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function createPage(template, components, fileExtension) {
    try {
        const templatePageString = await fsPromises.readFile(template, encoding);
        let page = templatePageString;
        const pageComponents = await readFolder(components);
        const markers = ['header', 'articles', 'footer'];
        for (let i = 0; i < pageComponents.length; i ++) {
            const item = pageComponents[i];
            const itemExtension = getFileExtension(item.name);
            const itemName = getFileName(item.name, itemExtension);

            if (!item.isDirectory() && itemExtension === fileExtension && markers.includes(itemName)) {
                const itemPath = path.join(components, item.name);
                const component = await fsPromises.readFile(itemPath, encoding);
                const regex = `{{${itemName}}}`;
                page = page.replace(regex, component);
            }
        }
        return page;
    } catch (error) {
        console.log(error.message);
    }

}

function getFileName(filename, extension) {
    return path.basename(filename, extension);
}