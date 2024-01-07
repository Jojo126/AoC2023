const fs = require('node:fs/promises');

async function example() {
    try {
        let input = await fs.readFile('./input.txt', { encoding: 'utf8' });

        // Unfold input
        let rows = input.split('\r\n').map(row => {
            let temp = row.split(' ');
            temp[1] = temp[1].split(',').map(num => parseInt(num));
        
            // Unfold records
            let unfolded = [[],[]];
            for(let i = 0; i < 5; i++) {
                unfolded[0].push(temp[0]);
                unfolded[1] = [...unfolded[1],...temp[1]];
            }
            unfolded[0] = unfolded[0].join('?');
            
            return unfolded;
        });

        let totalArrangements = 0;
        // Dynamic programming
        rows.forEach(row => {
            // DP table
            let memo = Array.from({length: row[1].length}, () => Array(row[0].length).fill(0));
            // Add extra first row with matches for empty group input ([0])
            memo.unshift([...new Array((row[0].indexOf('#') !== -1 ? row[0].indexOf('#') : row[0].length)).fill(1), ...new Array(row[0].length-(row[0].indexOf('#') !== -1 ? row[0].indexOf('#') : row[0].length)).fill(0)]);

            const getPreviousGroupsNumberArrangements = (i, j) => {
                let groupSize = row[1][i-1]; // (row[1] does not contain group 0 causing index offset)
                let startsOnDot = row[0][j-groupSize] !== '#'; // The group cannot begin directly after a # since that would then be part of the group, altering the length.
                let isOneGroup = row[0].substring(j+1-groupSize, j+1).indexOf('.') === -1; // Any dot in the sequence would split it into multiple groups
                let isInsideRange = (j+1)-groupSize >= 0; // All chars in the groups has to be defined within the string, i.e. the first index of the group cannot start outside/before the string. (j is zero-indexed)
                let isCompleteGroup = isInsideRange && startsOnDot && isOneGroup;
                if(isCompleteGroup) {
                    let startOfTable = i === 1 && (j-groupSize === -1 || j-groupSize === 0);
                    // Tries to fetch prev number arrangements from outside "0" row
                    if(startOfTable)
                        return 1;
                    else if(memo[i-1][j-groupSize-1]) {
                        return memo[i-1][j-groupSize-1];
                    }
                }
                return 0;
            };

            // Iterate over DP table to populate it with number valid arrangements for each cell
            for(let i = 1; i <= row[1].length; i++) { // Skipping group 0, already filled when the row was created
                for(let j = 0; j < row[0].length; j++) {
                    // Determine cells possible arrangements
                    let charArrangements = 0;
                    // Same number of valid arrangements as before
                    if((row[0][j] === '.' || row[0][j] === '?') && memo[i][j-1]) {
                        charArrangements += memo[i][j-1];
                    }
                    // Last found number valid arrangements excluding this group and the last part of the sequence only this group can occupie
                    if(row[0][j] === '#' || row[0][j] === '?') {
                        charArrangements += getPreviousGroupsNumberArrangements(i,j);
                    }
                    memo[i][j] = charArrangements;
                }
            }
            totalArrangements += memo[row[1].length][row[0].length-1];
            //console.log(memo[row[1].length][row[0].length-1], row[0], row[1].join(' '))
        });
        console.log('Total number arrangements:', totalArrangements)
        
    } catch (err) {
        console.log(err);
    }
}
example();