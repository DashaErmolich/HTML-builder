const { createWriteStream } = require('fs');
const { join } = require('path');
const readline = require('readline');

const newFileName = 'user-text.txt';
const encoding = 'utf-8';

const newFilePath = join(__dirname, newFileName);
const writeFileStream = createWriteStream(newFilePath, encoding);

writeFileStream.on('error', error => {
    process.stdout.write(error.message);
})

const newReadLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Write your message: '
})

newReadLine.prompt();

newReadLine.on('line', message => {
    if (message === 'exit') {
        newReadLine.close();
    } else {
        text = message + '\n';
        writeFileStream.write(text);
        newReadLine.prompt();
    }
})

newReadLine.on('SIGINT', () => {
    newReadLine.close();
})

newReadLine.on('close', () => {
    writeFileStream.end();
    writeFileStream.on('finish', () => {
        process.stdout.write(`\nYour messages were added to the "${newFileName}" file!`);
        process.exit();
    })
})