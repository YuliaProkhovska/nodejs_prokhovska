const _ = require('lodash');

//  метод add з lodash
const additionResult = _.add(5, 3);
console.log('Результат методу №1:', additionResult); //  сума чисел на консоль

// метод shuffle з lodash
const shuffledArray = _.shuffle([1, 2, 3, 4, 5]);
console.log('Результат методу №2:', shuffledArray); //  перетасований рандомно масив на консоль

// метод reverse з lodash
const reversedArray = _.reverse([1, 2, 3, 4, 5]);
console.log('Результат методу №3:', reversedArray); //  змінений в обратному порядку масив на консоль

// метод reverse з lodash
const originalString = 'Hello, World!';
const reversedString = _.reverse(originalString.split('')).join('');
console.log('Результат методу №4:', reversedString); // обернення порядку символів у рядку

// метод toUpper з lodash
const inputString = 'Hello, World!';
const result = _.toUpper(inputString);
console.log('Результат методу №5:', result); // перетворення рядка в верхній регістр
