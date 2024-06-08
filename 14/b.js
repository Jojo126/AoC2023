const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });

        let matrix = input.split('\r\n').map(matrix => matrix.split(''));

        const moveStoneNorth = (row, col, matrix) => {
            for(let topRow = row; topRow >= 0; topRow--) {
                if(row === 1 && matrix[0][col] === '.') {
                    matrix[row][col] = '.';
                    matrix[0][col] = 'O';
                    return;
                }
                else if(matrix[topRow-1][col] !== '.') {
                    matrix[row][col] = '.';
                    matrix[topRow][col] = 'O';
                    return;
                }
                else if(topRow-1 === 0) {
                    matrix[row][col] = '.';
                    matrix[topRow-1][col] = 'O';
                    return;
                }
            }
        };
        const moveStoneWest = (row, col, matrix) => {
            for(let leftCol = col; leftCol >= 0; leftCol--) {
                if(col === 1 && matrix[row][0] === '.') {
                    matrix[row][col] = '.';
                    matrix[row][0] = 'O';
                    return;
                }
                else if(matrix[row][leftCol-1] !== '.') {
                    matrix[row][col] = '.';
                    matrix[row][leftCol] = 'O';
                    return;
                }
                else if(leftCol-1 === 0) {
                    matrix[row][col] = '.';
                    matrix[row][leftCol-1] = 'O';
                    return;
                }
            }
        };
        const moveStoneSouth = (row, col, matrix) => {
            for(let bottomRow = row; bottomRow < matrix.length-1; bottomRow++) {
                if(row === matrix.length-1 && matrix.at(-1)[col] === '.') {
                    matrix[row][col] = '.';
                    matrix.at(-1)[col] = 'O';
                    return;
                }
                else if(matrix[bottomRow+1][col] !== '.') {
                    matrix[row][col] = '.';
                    matrix[bottomRow][col] = 'O';
                    return;
                }
                else if(bottomRow+1 === matrix.length-1) {
                    matrix[row][col] = '.';
                    matrix[bottomRow+1][col] = 'O';
                    return;
                }
            }
        };
        const moveStoneEast = (row, col, matrix) => {
            for(let rightCol = col; rightCol < matrix[row].length-1; rightCol++) {
                if(col === matrix[row].length && matrix[row].at(-1) === '.') {
                    matrix[row][col] = '.';
                    matrix[row].at(-1) = 'O';
                    return;
                }
                else if(matrix[row][rightCol+1] !== '.') {
                    matrix[row][col] = '.';
                    matrix[row][rightCol] = 'O';
                    return;
                }
                else if(rightCol+1 === matrix[row].length-1) {
                    matrix[row][col] = '.';
                    matrix[row][rightCol+1] = 'O';
                    return;
                }
            }
        };

        const getLoad = (matrix) => {
            return matrix.reduce((acc, row, i) => {
                const occurrences = row.reduce((acc,char) => {
                    return char === 'O' ? acc+1 : acc;
                }, 0);
                return acc + occurrences * (matrix.length-i);
            }, 0);
        };

        let cycleHistory = [];
        for(let cycle = 1; cycle <= 1000000000; cycle++) {
            // North
            for(let i = 1; i < matrix.length; i++) {
                for(let j = 0; j < matrix[i].length; j++) {
                    if(matrix[i][j] === 'O')
                        moveStoneNorth(i, j, matrix);
                }    
            }
            // West
            for(let i = 0; i < matrix.length; i++) {
                for(let j = 1; j < matrix[i].length; j++) {
                    if(matrix[i][j] === 'O')
                        moveStoneWest(i, j, matrix);
                }    
            }
            // South
            for(let i = matrix.length-1; i >= 0; i--) {
                for(let j = 0; j < matrix[i].length; j++) {
                    if(matrix[i][j] === 'O')
                        moveStoneSouth(i, j, matrix);
                }    
            }
            // East
            for(let i = 0; i < matrix.length; i++) {
                for(let j = matrix[i].length-1; j >= 0; j--) {
                    if(matrix[i][j] === 'O')
                        moveStoneEast(i, j, matrix);
                }    
            }

            // Found a cycle loop!
            // (This solution expects to find a constant loop eventually that can be utilized to immediately 
            // find the state of the 1000000000 iteration without looping all the way to it)
            if(cycleHistory.some(cycle => JSON.stringify(cycle.matrix) === JSON.stringify(matrix))) {
                let startOfFirstCycle = cycleHistory.find(histCycle => JSON.stringify(histCycle.matrix) === JSON.stringify(matrix));
                let cycleLength = cycle - startOfFirstCycle.iteration;
                let index = (cycle-1) + (((1000000000 - (cycle-1)) % cycleLength) - cycleLength) - 1;
                console.log('res', getLoad(cycleHistory.at(index).matrix));
                return;
            }
            cycleHistory.push({iteration: cycle, matrix: JSON.parse(JSON.stringify(matrix))});
        }
        
    } catch (err) {
        console.log(err);
    }
}
example();