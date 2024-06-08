const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });

        let grid = input.split('\r\n');
        
        // Expand universe
        let expandedUniverse = [];
        grid.forEach(row => {
            expandedUniverse.push(Array.from(row));
            if(Array.from(row).every(cell => cell === '.')) {
                expandedUniverse.push(Array.from(row));
            }
        });
        let expandCols = [];
        for(let i = 0; i < expandedUniverse[0].length; i++) {
            if(expandedUniverse.every(row => row[i] === '.')) {
                expandCols.push(i);
            }
        }
        expandCols.forEach((colIndex,index) => {
            expandedUniverse.map(row => {
                return row.splice(colIndex+index,0,'.');
            });
        });

        // Find galaxies
        let galaxies = [];
        let primKey = 0;
        expandedUniverse.forEach((rows,i) => {
            rows.forEach((cell,j) => {
                if(cell === '#') {
                    galaxies.push({id: primKey, row: i, col: j})
                    primKey++;
                }
            });
        });

        // Get all unique pairs
        let pairs = [];
        for(let a = 0; a < galaxies.length; a++) {
            for(let b = a + 1; b < galaxies.length; b++) {
                let horDist = Math.abs(galaxies[b].col - galaxies[a].col);
                let vertDist = Math.abs(galaxies[b].row - galaxies[a].row);
                pairs.push({a: galaxies[a], b: galaxies[b], distance: horDist + vertDist});
            }
        }
        console.log(pairs.reduce((acc,pair) => {return acc + pair.distance}, 0));

    } catch (err) {
        console.log(err);
    }
}
example();