const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });

        let grid = input.split('\r\n');
        
        // Find where the universe expands
        let expandRows = [];
        grid.forEach((row,i) => {
            if(Array.from(row).every(cell => cell === '.')) {
                expandRows.push(i);
            }
        });
        let expandCols = [];
        for(let i = 0; i < grid[0].length; i++) {
            if(grid.every(row => row[i] === '.')) {
                expandCols.push(i);
            }
        }

        // Find galaxies
        let galaxies = [];
        let primKey = 0;
        grid.forEach((rows,i) => {
            Array.from(rows).forEach((cell,j) => {
                if(cell === '#') {
                    galaxies.push({id: primKey, row: i, col: j})
                    primKey++;
                }
            });
        });

        // Get all unique pairs expanded distances
        let pairs = [];
        let expandFact = 10; // Example input
        //let expandFact = 1000000;
        for(let a = 0; a < galaxies.length; a++) {
            for(let b = a + 1; b < galaxies.length; b++) {
                let colsToExpand = expandCols.filter(expCol => Math.min(galaxies[a].col,galaxies[b].col) < expCol && expCol < Math.max(galaxies[a].col,galaxies[b].col));
                let rowsToExpand = expandRows.filter(expRow => Math.min(galaxies[a].row,galaxies[b].row) < expRow && expRow < Math.max(galaxies[a].row,galaxies[b].row));
                let horDist = Math.abs(galaxies[b].col - galaxies[a].col) + colsToExpand.length * (expandFact-1);
                let vertDist = Math.abs(galaxies[b].row - galaxies[a].row) + rowsToExpand.length * (expandFact-1);
                pairs.push({a: galaxies[a], b: galaxies[b], distance: horDist + vertDist});
            }
        }
        console.log(pairs.reduce((acc,pair) => acc + pair.distance, 0));

    } catch (err) {
        console.log(err);
    }
}
example();