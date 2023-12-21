const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });

        const grid = input.split('\r\n');
        const loopGrid = JSON.parse(JSON.stringify(grid.map(row => Array.from(row))));

        // Find the S
        let start;
        grid.forEach((row, i) => {
            if(row.includes('S'))
                start = [i, row.indexOf('S')];
        });
        loopGrid[start[0]][start[1]] = 'X';

        // Start from both ends of S
        //let end1 = {coords: [start[0],start[1]+1], prevDir: 'L'};
        //let end2 = {coords: [start[0]+1,start[1]], prevDir: 'U'};
        let end1 = {coords: [start[0],start[1]-1], prevDir: 'R'};
        let end2 = {coords: [start[0]-1,start[1]], prevDir: 'D'};
        //let end1 = {coords: [start[0],start[1]-1], prevDir: 'R'};
        //let end2 = {coords: [start[0]+1,start[1]], prevDir: 'U'};

        // Step through the loop
        const move = (coord, prevDir) => {
            const currentlyVisited = grid[coord[0]][coord[1]];
            loopGrid[coord[0]][coord[1]] = 'X';

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
        while(JSON.stringify([end1.coords[0],end1.coords[1]]) !== JSON.stringify([end2.coords[0],end2.coords[1]])) {
            end1 = move(end1.coords, end1.prevDir);
            end2 = move(end2.coords, end2.prevDir);
        }
        end1 = move(end1.coords, end1.prevDir);
        loopGrid[end1.coords[0]][end1.coords[1]] = 'X';

        // Traverse again to map out inside/outside
        //end1 = {coords: [start[0],start[1]+1], prevDir: 'L'};
        //end2 = {coords: [start[0]+1,start[1]], prevDir: 'U'};
        end1 = {coords: [start[0],start[1]-1], prevDir: 'R'};
        end2 = {coords: [start[0]-1,start[1]], prevDir: 'D'};
        //end1 = {coords: [start[0],start[1]-1], prevDir: 'R'};
        //end2 = {coords: [start[0]+1,start[1]], prevDir: 'U'};

        // Step through the loop
        const findInsideOutside = (coord, prevDir) => {
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
            
            if(prevDir === 'L') {
                let outsideLength = loopGrid.map(row => row[coord[1]]).join('').slice(0, coord[0]).split('X').at(-1).length;
                let insideLength = loopGrid.map(row => row[coord[1]]).join('').slice(coord[0]+1).split('X')[0].length;

                for(i = coord[0]+1; i < coord[0]+1+insideLength; i++) {
                    loopGrid[i][coord[1]] = 'I';
                }
                for(i = coord[0]-outsideLength; i < coord[0]; i++) {
                    loopGrid[i][coord[1]] = 'O';
                }

                if(grid[coord[0]][coord[1]] === '7') {
                    let additionalOutsideLength = loopGrid[coord[0]].slice([coord[1]+1]).join('').split('X')[0].length;
                    for(i = coord[1]+1; i < coord[1]+1+additionalOutsideLength; i++) {
                        loopGrid[coord[0]][i] = 'O';
                    }
                }
                else if(grid[coord[0]][coord[1]] === 'J') {
                    let additionalOutsideLength = loopGrid[coord[0]].slice([coord[1]+1]).join('').split('X')[0].length;
                    for(i = coord[1]+1; i < coord[1]+1+additionalOutsideLength; i++) {
                        loopGrid[coord[0]][i] = 'I';
                    }
                }
            }
            else if(prevDir === 'R') {
                let outsideLength = loopGrid.map(row => row[coord[1]]).join('').slice(coord[0]+1).split('X')[0].length;
                let insideLength = loopGrid.map(row => row[coord[1]]).join('').slice(0, coord[0]).split('X').at(-1).length;

                for(i = coord[0]+1; i < coord[0]+1+outsideLength; i++) {
                    loopGrid[i][coord[1]] = 'O';
                }
                for(i = coord[0]-insideLength; i < coord[0]; i++) {
                    loopGrid[i][coord[1]] = 'I';
                }

                if(grid[coord[0]][coord[1]] === 'F') {
                    let additionalOutsideLength = loopGrid[coord[0]].slice(0, [coord[1]]).join('').split('X').at(-1).length;
                    for(i = coord[1]-additionalOutsideLength; i < coord[1]; i++) {
                        loopGrid[coord[0]][i] = 'I';
                    }
                }
                else if(grid[coord[0]][coord[1]] === 'L') {
                    let additionalOutsideLength = loopGrid[coord[0]].slice(0, [coord[1]]).join('').split('X').at(-1).length;
                    for(i = coord[1]-additionalOutsideLength; i < coord[1]; i++) {
                        loopGrid[coord[0]][i] = 'O';
                    }
                }
            }
            else if(prevDir === 'U') {
                let outsideLength = loopGrid[coord[0]].slice([coord[1]+1]).join('').split('X')[0].length;
                let insideLength = loopGrid[coord[0]].slice(0, [coord[1]]).join('').split('X').at(-1).length;
                
                for(i = coord[1]+1; i < coord[1]+1+outsideLength; i++) {
                        loopGrid[coord[0]][i] = 'O';
                }
                for(i = coord[1]-insideLength; i < coord[1]; i++) {
                    loopGrid[coord[0]][i] = 'I';
                }

                if(grid[coord[0]][coord[1]] === 'L') {
                    let additionalOutsideLength = loopGrid.map(row => row[coord[1]]).join('').slice(coord[0]+1).split('X')[0].length;
                    for(i = coord[0]+1; i < coord[0]+1+additionalOutsideLength; i++) {
                        loopGrid[i][coord[1]] = 'I';
                    }
                }
                else if(grid[coord[0]][coord[1]] === 'J') {                    
                    let additionalOutsideLength = loopGrid.map(row => row[coord[1]]).join('').slice(coord[0]+1).split('X')[0].length;
                    for(i = coord[0]+1; i < coord[0]+1+additionalOutsideLength; i++) {
                        loopGrid[i][coord[1]] = 'O';
                    }
                }
            }
            else if(prevDir === 'D') {
                let insideLength = loopGrid[coord[0]].slice([coord[1]+1]).join('').split('X')[0].length;
                let outsideLength = loopGrid[coord[0]].slice(0, [coord[1]]).join('').split('X').at(-1).length;

                for(i = coord[1]+1; i < coord[1]+1+insideLength; i++) {
                    loopGrid[coord[0]][i] = 'I';
                }
                for(i = coord[1]-outsideLength; i < coord[1]; i++) {
                    loopGrid[coord[0]][i] = 'O';
                }

                if(grid[coord[0]][coord[1]] === 'F') {
                    let additionalOutsideLength = loopGrid.map(row => row[coord[1]]).join('').slice(0, coord[0]).split('X').at(-1).length;
                    for(i = coord[0]-additionalOutsideLength; i < coord[0]; i++) {
                        loopGrid[i][coord[1]] = 'O';
                    }
                }
                else if(grid[coord[0]][coord[1]] === '7') {                    
                    let additionalOutsideLength = loopGrid.map(row => row[coord[1]]).join('').slice(0, coord[0]).split('X').at(-1).length;
                    for(i = coord[0]-additionalOutsideLength; i < coord[0]; i++) {
                        loopGrid[i][coord[1]] = 'I';
                    }
                }
            }
            
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
        while(JSON.stringify([end1.coords[0],end1.coords[1]]) !== JSON.stringify(start)) {
            end1 = findInsideOutside(end1.coords, end1.prevDir);
        }
        end1 = findInsideOutside(end1.coords, end1.prevDir);

        // Sum num I/O in grid
        let insideCells = loopGrid.reduce((acc,val) => {
            return acc + (val.reduce((acc,val) => {
                if(val === 'I') {
                    return acc+1;
                } else {
                    return acc;
                }
            },0));
        },0);
        let outsideCells = loopGrid.reduce((acc,val) => {
            return acc + (val.reduce((acc,val) => {
                if(val === 'O') {
                    return acc+1;
                } else {
                    return acc;
                }
            },0));
        },0);
        console.log('Cells inside loop:', insideCells, 'Cells outside loop:', outsideCells);
        
        // Show final grid
        //loopGrid.forEach(row => console.log(row.join('')))

    } catch (err) {
        console.log(err);
    }
}
example();