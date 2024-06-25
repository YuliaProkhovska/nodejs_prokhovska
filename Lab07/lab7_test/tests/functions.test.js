const { factorial } = require('../utils/functions');
const mocha = require('mocha');

const valueDictionary = {
    5: 120,
    6: 720,
    0: 1,
    "-5": null,
    "-6": null
};

describe('Factorial function', () => {
    for (let [number, expected] of Object.entries(valueDictionary)) {
        it(`should return ${expected} for number ${number}`, () => {
            let result = factorial(parseInt(number));
            let correct = expected;

            if (result !== correct) {
                throw new Error(`Incorrect result of factorial for number ${number}. Expected ${correct}, but got ${result}.`);
            }
        });
    }
});