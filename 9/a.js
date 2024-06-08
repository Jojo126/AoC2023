const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        
        let readings = input.split('\r\n').map(row => [row.split(' ').map(val => parseInt(val))]);

        readings.map(reading => {
            // Get sequences
            while(reading.at(-1).some(val => val !== 0)) {
                let newSequence = [];
                for(let i = 0; i < reading.at(-1).length-1; i++) {
                    newSequence.push(reading.at(-1)[i+1] - reading.at(-1)[i])
                }
                reading.push(newSequence);
            }

            // Extrapolate prediction
            reading.at(-1).push(0);
            for(let i = reading.length-2; i >= 0; i--) {
                reading[i].push(reading[i].at(-1) + reading[i+1].at(-1));
            }
            return reading;
        })

        console.log(readings.reduce((acc,reading) => acc += reading[0].at(-1), 0))

    } catch (err) {
        console.log(err);
    }
}
example();