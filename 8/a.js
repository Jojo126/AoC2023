const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });
        
        let parsedInput = {
            roadToGlory: input.split('\n')[0].trim()
        };
        
        input.split('\n').slice(2).forEach(row => {
            parsedInput[row.substring(0,3)] = {
                left: row.substring(7,10), 
                right: row.substring(12,15)
            };
        });

        let steps = 0;
        let i = 'AAA';
        while(i !== 'ZZZ') {
            steps++;
            i = parsedInput.roadToGlory[(steps-1) % parsedInput.roadToGlory.length] === 'L' ? parsedInput[i].left : parsedInput[i].right;
        }

        console.log(steps);


    } catch (err) {
        console.log(err);
    }
}
example();