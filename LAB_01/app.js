const yargs = require('yargs');
const user = require('./user');

const argv = yargs
    .command('add', 'Додати нову мову', {
        title: {
            describe: 'Назва мови',
            demand: true,
            alias: 't'
        },
        level: {
            describe: 'Рівень володіння мовою',
            demand: true,
            alias: 'l'
        }
    })
    .command('remove', 'Видалити мову', {
        title: {
            describe: 'Назва мови для видалення',
            demand: true,
            alias: 't'
        }
    })
    .command('list', 'Вивести список всіх мов')
    .command('read', 'Вивести інформацію про мову', {
        title: {
            describe: 'Назва мови для перегляду',
            demand: true,
            alias: 't'
        }
    })
    .help()
    .argv;

const command = argv._[0];

if (command === 'add') {
    user.addLanguage(argv.title, argv.level);
} else if (command === 'remove') {
    user.removeLanguage(argv.title);
} else if (command === 'list') {
    user.listLanguages();
} else if (command === 'read') {
    user.readLanguage(argv.title);
} else {
    console.log('Команда не існує');
}
