const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });

        const getGrid = () => {
            return input.split('\r\n').map(row => row.split('').map(char => {
                return {
                    char: char,
                    top: false,
                    bottom: false,
                    left: false,
                    right: false
                };
            }));
        };
        let grid = getGrid();

        let maxEnergized = 0;
        const updateMostEnergized = () => {
            const currEnergized = grid.reduce((acc, row) => acc += row.reduce((rowAcc, cell) => rowAcc += cell.top || cell.bottom || cell.left || cell.right ? 1 : 0, 0), 0);
            if(currEnergized > maxEnergized) 
                maxEnergized = currEnergized;
        };

        const traverse = turtle => {
            if(turtle.i === -1)
                turtle.i = 0;
            else if(turtle.j === -1)
                turtle.j = 0;
            else if(turtle.i === grid.length)
                turtle.i = grid.length-1;
            else if(turtle.j === grid[0].length)
                turtle.j = grid[0].length-1;
            else {
                // Go to the next tile
                if(turtle.direction === 'L' && grid[turtle.i][turtle.j].left === false) {
                    grid[turtle.i][turtle.j].left = true;
                    
                    if(turtle.j <= 0) return;
                    turtle.j = turtle.j - 1;
                }
                else if(turtle.direction === 'R' && grid[turtle.i][turtle.j].right === false) {
                    grid[turtle.i][turtle.j].right = true;

                    if(turtle.j >= grid[turtle.i].length-1) return;
                    turtle.j = turtle.j + 1;
                }
                else if(turtle.direction === 'T' && grid[turtle.i][turtle.j].top === false) {
                    grid[turtle.i][turtle.j].top = true;

                    if(turtle.i <= 0) return;
                    turtle.i = turtle.i - 1;
                }
                else if(turtle.direction === 'B' && grid[turtle.i][turtle.j].bottom === false) {
                    grid[turtle.i][turtle.j].bottom = true;

                    if(turtle.i >= grid.length-1) return;
                    turtle.i = turtle.i + 1;
                }
                else
                    return;
            }

            // Update direction to new tile
            const newChar = grid[turtle.i][turtle.j].char;
            if(newChar === '.') {
                // Just continue forward...
                traverse({...turtle});
            } else if(newChar === '|') {
                // Just continue forward or split
                if(turtle.direction === 'L' || turtle.direction === 'R') {
                    traverse({...turtle, direction: 'T'});
                    traverse({...turtle, direction: 'B'});
                } else {
                    traverse({...turtle});
                }
            } else if(newChar === '-') {
                // Just continue forward or split
                if(turtle.direction === 'T' || turtle.direction === 'B') {
                    traverse({...turtle, direction: 'L'});
                    traverse({...turtle, direction: 'R'});
                } else {
                    traverse({...turtle});
                }
            } else if(newChar === '/') {
                // Turn 90 degrees
                if(turtle.direction === 'L') {
                    traverse({...turtle, direction: 'B'});
                } else if(turtle.direction === 'R') {
                    traverse({...turtle, direction: 'T'});
                } else if(turtle.direction === 'T') {
                    traverse({...turtle, direction: 'R'});
                } else if(turtle.direction === 'B') {
                    traverse({...turtle, direction: 'L'});
                }
            } else if(newChar === '\\') {
                // Turn 90 degrees
                if(turtle.direction === 'L') {
                    traverse({...turtle, direction: 'T'});
                } else if(turtle.direction === 'R') {
                    traverse({...turtle, direction: 'B'});
                } else if(turtle.direction === 'T') {
                    traverse({...turtle, direction: 'L'});
                } else if(turtle.direction === 'B') {
                    traverse({...turtle, direction: 'R'});
                }
            } else {
                console.log('no match! D:')
            }
        };

        // Left edge
        for(let i = 0; i < grid.length; i++) {
            // Reset grid and turtle
            grid = getGrid();
            let turtle = {
                i: i,
                j: -1,
                direction: 'R'
            };
            grid[i][0].left = true;
            
            traverse(turtle);

            updateMostEnergized();
        }
        // Right edge
        for(let i = 0; i < grid.length; i++) {
            // Reset grid and turtle
            grid = getGrid();
            let turtle = {
                i: i,
                j: grid[i].length,
                direction: 'L'
            };
            grid[i][grid[i].length-1].right = true;
            
            traverse(turtle);

            updateMostEnergized();
        }
        // Top edge
        for(let j = 0; j < grid[0].length; j++) {
            // Reset grid and turtle
            grid = getGrid();
            turtle = {
                i: -1,
                j: j,
                direction: 'B'
            };
            grid[0][j].top = true;
            
            traverse(turtle);

            updateMostEnergized();
        }
        // Bottom edge
        for(let j = 0; j < grid[0].length; j++) {
            // Reset grid and turtle
            grid = getGrid();
            turtle = {
                i: grid.length,
                j: j,
                direction: 'T'
            };
            grid[grid.length-1][j].bottom = true;
            
            traverse(turtle);

            updateMostEnergized();
        }
        
        console.log(maxEnergized);
        
    } catch (err) {
        console.log(err);
    }
}
example();