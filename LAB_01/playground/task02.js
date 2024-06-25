const fs = require('fs');

const filePath = 'task02.txt';

function appendToFile() {
    let content = '';
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {

    }

    content += 'Hello, World!\n';

    fs.writeFileSync(filePath, content, 'utf-8');

    console.log('Hello, World! додано до', filePath);
}

appendToFile();
