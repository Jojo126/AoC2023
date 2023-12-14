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

        let starts = Object.keys(parsedInput).filter(node => node.at(-1) === 'A');

        const getSteps = (start) => {
            let steps = 0;
            let i = start;
            while(i.at(-1) !== 'Z') {
                steps++;
                i = parsedInput.roadToGlory[(steps-1) % parsedInput.roadToGlory.length] === 'L' ? parsedInput[i].left : parsedInput[i].right;
            }
            return [i, steps];
        };
        const getSteps2 = (start) => {
            let steps = 0;
            let i = start;
            do {
                steps++;
                i = parsedInput.roadToGlory[(steps-1) % parsedInput.roadToGlory.length] === 'L' ? parsedInput[i].left : parsedInput[i].right;
            } while(i.at(-1) !== 'Z')
            return steps;
        };

        let ends = [];
        starts.forEach(start => {
            let [end, steps] = getSteps(start);
            ends.push({end: end, steps: steps});
        });
        ends = ends.map(end => {
            return {...end, repeatSteps: getSteps2(end.end)};
        });

        let x = 0;
        let res = new Array(ends.length);
        res = ends.map(end => end.steps + end.repeatSteps*x);

        const getPrims = (val) => {
            let comps = [];
            let i = 2;
            let num = val;
            while(i <= num) {
                if(num % i === 0) {
                    comps.push(i);
                    num /= i;
                }
                else
                    i++;
            }
            return comps;
        }
        console.log(res, res.map(val => getPrims(val))); // [[ 59, 269 ],[ 73, 269 ],[ 47, 269 ],[ 53, 269 ],[ 79, 269 ],[ 71, 269 ]]
        // -> LCM = [59, 73, 47, 53, 79, 71, 269] // === 16187743689077!

    } catch (err) {
        console.log(err);
    }
}
example();