const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });

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

        // From north to south, look for stones and move them up to the 
        // most northern point that the stone has a clear path to
        for(let i = 1; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                if(matrix[i][j] === 'O')
                moveStoneNorth(i, j, matrix);
            }    
        }

        // Get load
        const res = matrix.reduce((acc, row, i) => {
            const occurrences = row.reduce((acc,char) => {
                return char === 'O' ? acc+1 : acc;
            }, 0);
            return acc + occurrences * (matrix.length-i);
        }, 0);

        console.log('res', res);
        
    } catch (err) {
        console.log(err);
    }
}
example();