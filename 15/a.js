const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        let steps = input.split(',');

        const res = steps.reduce((acc, step) => {
            const sum = Array.from(step).reduce((currentValue, char) => {
                return ((currentValue + char.charCodeAt()) * 17) % 256;
            }, 0);
            return acc + sum;
        }, 0);

        console.log(res);
    } catch (err) {
        console.log(err);
    }
}
example();