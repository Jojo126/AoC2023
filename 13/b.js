const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });

        let matrices = input.split('\r\n\r\n').map(matrix => matrix.split('\r\n'));
        
        let leftCols = [];
        let aboveRows = [];
        const findHorizontalRefl = (matrix, prevRow = null) => {
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

                    if(prevRow !== i && isMirror) 
                        return i;
                }
            }
            return null;
        };
        const findVerticalRefl = (matrix, prevCol = null) => {
            for(let i = 1; i < matrix[0].length; i++) {
                let isMirror = true;
                for(let j = 0; j < matrix.length; j++) {
                    // Check rest of columns simultaneously by matching the substrings 
                    if(matrix[j].substring(i-Math.min(i, matrix[0].length-i), i) !== matrix[j].substring(i, i+Math.min(i, matrix[0].length-i)).split('').reverse().join('')) {
                        isMirror = false;
                        break;
                    }
                }
                
                if(prevCol !== i && isMirror)
                    return i;
            }
            return null;
        };

        matrices.forEach(matrix => {
            let smudgedReflLineRow = findHorizontalRefl(matrix);
            let smudgedReflLineCol = findVerticalRefl(matrix);

            for(let i = 0; i < matrix.length; i++) {
                for(let j = 0; j < matrix[i].length; j++) {
                    // Unsmudge matrix in cell [i,j]
                    let unsmudgedMatrix = JSON.parse(JSON.stringify(matrix));
                    unsmudgedMatrix[i] = unsmudgedMatrix[i].substring(0,j) + (unsmudgedMatrix[i][j] === '.' ? '#' : '.') + unsmudgedMatrix[i].substring(j+1);

                    // Search for new reflection line
                    let unsmudgedReflLineRow = findHorizontalRefl(unsmudgedMatrix, smudgedReflLineRow);
                    if(unsmudgedReflLineRow) {
                        aboveRows.push(unsmudgedReflLineRow);
                        return;
                    }
                    let unsmudgedReflLineCol = findVerticalRefl(unsmudgedMatrix, smudgedReflLineCol);
                    if(unsmudgedReflLineCol) {
                        leftCols.push(unsmudgedReflLineCol);
                        return;
                    }
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