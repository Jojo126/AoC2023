const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });

        let matrices = input.split('\r\n\r\n').map(matrix => matrix.split('\r\n'));
        let leftCols = [];
        let aboveRows = [];
        matrices.forEach(matrix => {
            // Horizontal line
            for(let i = 1; i <= matrix.length; i++) {
                let rowInMatrixIndex = i-1; // Matrix still 0-indexed because array ¯\_(ツ)_/¯
                if(matrix[rowInMatrixIndex] === matrix[rowInMatrixIndex+1]) {
                    // Rest of rows also has to match
                    let isMirror = true;
                    for(let j = 1; j < Math.min(i, matrix.length-i); j++) {
                        if(matrix[rowInMatrixIndex-j] !== matrix[rowInMatrixIndex+1+j]) {
                            isMirror = false;
                            break;
                        }
                    }

                    if(isMirror) {
                        //console.log('matrix', index, 'above rows', i);
                        aboveRows.push(i);
                        return;
                    }
                }
            }

            // Vertical line
            for(let i = 1; i < matrix[0].length; i++) {
                let isMirror = true;
                for(let j = 0; j < matrix.length; j++) {
                    // Check rest of columns simultaneously by matching the substrings 
                    if(matrix[j].substring(i-Math.min(i, matrix[0].length-i), i) !== matrix[j].substring(i, i+Math.min(i, matrix[0].length-i)).split('').reverse().join('')) {
                        isMirror = false;
                        break;
                    }
                }
                
                if(isMirror) {
                    //console.log('matrix', index, 'left cols', i)
                    leftCols.push(i);
                    return;
                }
            }
        });

        // Sum and combine results to get answer
        let res = leftCols.reduce((acc, cols) => acc += cols, 0) + 100 * aboveRows.reduce((acc, rows) => acc += rows, 0);
        console.log('res:', res)
        
    } catch (err) {
        console.log(err);
    }
}
example();