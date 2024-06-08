const fs = require('node:fs/promises');

async function example() {
    try {
        let data = await fs.readFile('./example_input.txt', { encoding: 'utf8' });

        /* Part 1 */
        /*
        const strings = data.split('\n').map(line => line.trim());
        const rows = strings.length;
        const cols = strings[0].length;

        let sum = 0;

        for(let i = 0; i < strings.length; i++) {
            const regex = /\d+/g;
            while((number = regex.exec(strings[i])) !== null) {
                
                const leftCol = number.index - 1;
                const rightCol = number.index + number[0].length + 1;
                const leftColAvailable = leftCol >= 0;
                const rightColAvailable = rightCol + 1 <= cols;

                const symbolToLeft = leftColAvailable && !strings[i][leftCol].match(/^(\d|\.)*$/);
                const symbolToRight = rightColAvailable && !strings[i][rightCol-1].match(/^(\d|\.)*$/);
                const symbolAbove = i-1 >= 0 && !strings[i-1].substring(leftColAvailable ? leftCol : leftCol + 1, rightColAvailable ? rightCol : rightCol - 1).match(/^(\d|\.)*$/);
                const symbolBelow = i+1 <= rows-1 && !strings[i+1].substring(leftColAvailable ? leftCol : leftCol + 1, rightColAvailable ? rightCol : rightCol - 1).match(/^(\d|\.)*$/);

                if(symbolToLeft || symbolToRight || symbolAbove || symbolBelow)
                    sum += parseInt(strings[i].substring(number.index, number.index + number[0].length));
            }
        }
        console.log(sum);
        */
        
        /* Part 2 */

        const strings = data.split('\n').map(line => line.trim());
        const rows = strings.length;
        const cols = strings[0].length;

        let sum = 0;

        for(let i = 0; i < strings.length; i++) {
            const regex = /\*/g;
            while((number = regex.exec(strings[i])) !== null) {
                let numAdjacent = [];

                const leftCol = number.index - 1;
                const rightCol = number.index + 1;
                const leftColAvailable = leftCol >= 0;
                const rightColAvailable = rightCol < cols;

                const digitRegex = /\d+/g;
                const digitToLeft = leftColAvailable && strings[i][leftCol].match(digitRegex) !== null;
                if(digitToLeft) {
                    numAdjacent.push(parseInt(strings[i].substring(0,number.index).match(digitRegex).at(-1)));
                } 
                const digitToRight = rightColAvailable && strings[i][rightCol].match(digitRegex) !== null;
                if(digitToRight) {
                    numAdjacent.push(parseInt(strings[i].substring(number.index).match(digitRegex)));
                } 

                const aboveRowMatches = i-1 >= 0 ? strings[i-1].substring(leftColAvailable ? leftCol : leftCol + 1, rightColAvailable ? rightCol + 1 : rightCol).match(digitRegex) : null;
                const digitAbove = i-1 >= 0 && aboveRowMatches !== null;
                if(digitAbove) {
                    while(foundNumber = digitRegex.exec(strings[i-1])) {
                        let isAdjacent = [...Array(parseInt(cols)).keys()]
                            .slice(foundNumber.index, foundNumber.index + parseInt(foundNumber[0].length))
                            .some(index => {
                                return index === (leftColAvailable ? leftCol : leftCol + 1) || index === number.index || index === (rightColAvailable ? rightCol + 1 : rightCol)-1;
                        });
                        if(isAdjacent) {
                            numAdjacent.push(parseInt(foundNumber[0]));
                        }
                    }
                } 
                const belowRowMatches = i+1 <= rows-1 ? strings[i+1].substring(leftColAvailable ? leftCol : leftCol + 1, rightColAvailable ? rightCol + 1 : rightCol).match(digitRegex) : null;
                const digitBelow = i+1 <= rows-1 && belowRowMatches !== null;
                if(digitBelow) {
                    while(foundNumber = digitRegex.exec(strings[i+1])) {
                        let isAdjacent = [...Array(parseInt(cols)).keys()]
                            .slice(foundNumber.index, foundNumber.index + parseInt(foundNumber[0].length))
                            .some(index => {
                                return index === (leftColAvailable ? leftCol : leftCol + 1) || index === number.index || index === (rightColAvailable ? rightCol + 1 : rightCol)-1;
                        });
                        if(isAdjacent) {
                            numAdjacent.push(parseInt(foundNumber[0]));
                        }
                    }
                }

                if(numAdjacent.length === 2) {
                    sum += numAdjacent[0] * numAdjacent[1];
                }
            }
        }
        console.log(sum);

    } catch (err) {
        console.log(err);
    }
}
example();