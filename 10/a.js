const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });

        const grid = input.split('\r\n');
        let rows = grid.length;
        let columns = grid[0].length;

        // Find the S
        let start;
        grid.forEach((row, i) => {
            if(row.includes('S'))
                start = [i, row.indexOf('S')];
        });

        // Start from both ends of S
        let steps = 1;
        let end1 = {coords: [start[0],start[1]-1], prevDir: 'R'};
        let end2 = {coords: [start[0]-1,start[1]], prevDir: 'D'};

        // Step through the loop
        const move = (coord, prevDir) => {
            const currentlyVisited = grid[coord[0]][coord[1]];
            let canGoLeft = (currentlyVisited === 'S' ||
                currentlyVisited === '-' || 
                currentlyVisited === 'J' || 
                currentlyVisited === '7') && 
                (grid[coord[0]][coord[1]-1] === 'S' || 
                grid[coord[0]][coord[1]-1] === '-' || 
                grid[coord[0]][coord[1]-1] === 'L' || 
                grid[coord[0]][coord[1]-1] === 'F');
            let canGoRight = (currentlyVisited === 'S' ||
                currentlyVisited === '-' || 
                currentlyVisited === 'L' || 
                currentlyVisited === 'F') &&
                (grid[coord[0]][coord[1]+1] === 'S' || 
                grid[coord[0]][coord[1]+1] === '-' || 
                grid[coord[0]][coord[1]+1] === 'J' || 
                grid[coord[0]][coord[1]+1] === '7');
            let canGoUp = (currentlyVisited === 'S' ||
                currentlyVisited === '|' || 
                currentlyVisited === 'L' || 
                currentlyVisited === 'J') &&
                (grid[coord[0]-1][coord[1]] === 'S' || 
                grid[coord[0]-1][coord[1]] === '|' || 
                grid[coord[0]-1][coord[1]] === '7' || 
                grid[coord[0]-1][coord[1]] === 'F');
            let canGoDown = (currentlyVisited === 'S' ||
                currentlyVisited === '|' || 
                currentlyVisited === '7' || 
                currentlyVisited === 'F') &&
                (grid[coord[0]+1][coord[1]] === 'S' || 
                grid[coord[0]+1][coord[1]] === '|' || 
                grid[coord[0]+1][coord[1]] === 'L' || 
                grid[coord[0]+1][coord[1]] === 'J');

            if(canGoLeft && prevDir !== 'L') {
                return {coords: [coord[0],coord[1]-1], prevDir: 'R'};
            }
            else if(canGoRight && prevDir !== 'R') {
                return {coords: [coord[0],coord[1]+1], prevDir: 'L'};
            }
            else if(canGoUp && prevDir !== 'U') {
                return {coords: [coord[0]-1,coord[1]], prevDir: 'D'};
            }
            else if(canGoDown && prevDir !== 'D') {
                return {coords: [coord[0]+1,coord[1]], prevDir: 'U'};
            }
        };
        while(JSON.stringify([end1.coords[0],end1.coords[1]]) !== JSON.stringify([end2.coords[0],end2.coords[1]]) && steps < (rows*columns)) {
            steps++;
            end1 = move(end1.coords, end1.prevDir);
            end2 = move(end2.coords, end2.prevDir);
        }
        console.log(steps);

    } catch (err) {
        console.log(err);
    }
}
example();