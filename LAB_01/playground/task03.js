const os = require('os');
const fs = require('fs');

const userName = os.userInfo().username;
const greeting = `Hello, ${userName}!`;

const filePath = 'task03.txt';
fs.writeFileSync(filePath, greeting, 'utf-8');

console.log(greeting);

console.log(`Данні перенесено до ${filePath}`);
