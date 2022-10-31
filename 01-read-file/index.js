const { createReadStream } = require('fs');
const { join } = require('path');

const fileToReadName = 'text.txt';
const encoding = 'utf-8';

const fileToReadPath = join(__dirname, fileToReadName);
const readFileStream = createReadStream(fileToReadPath, encoding);

readFileStream.on('error', error => {
    process.stdout.write(error.message);
});

readFileStream.on('data', chunk => {
    process.stdout.write(chunk)
});