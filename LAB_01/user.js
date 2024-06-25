const fs = require('fs');

const user = {
    firstName: 'Mike',
    lastName: 'Sticks',
    languages: [],

    addLanguage: function (name, level) {
        const language = { name, level };
        this.languages.push(language);
        this.saveUser();
        console.log('Language added successfully.');
    },

    removeLanguage: function (name) {
        const index = this.languages.findIndex(language => language.name === name);
        if (index !== -1) {
            this.languages.splice(index, 1);
            this.saveUser();
            console.log('Language removed successfully.');
        } else {
            console.log('Language not found.');
        }
    },

    listLanguages: function () {
        console.log('Languages:');
        this.languages.forEach(language => {
            console.log(`Name: ${language.name}, Level: ${language.level}`);
        });
    },

    readLanguage: function (name) {
        const language = this.languages.find(language => language.name === name);
        if (language) {
            console.log(`Name: ${language.name}, Level: ${language.level}`);
        } else {
            console.log('Language not found.');
        }
    },

    saveUser: function () {
        const data = JSON.stringify(this, null, 2);
        fs.writeFileSync('user.json', data);
    }
};

module.exports = user;
