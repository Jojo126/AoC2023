const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });
        const digPlan = input.split('\r\n').map(row => {
            const values = row.split(' ');
            return {
                direction: values[0],
                steps: Number.parseInt(values[1]),
                color: values[2].substring(1, values[2].length-1)
            };
        });

        // Start at [0,0] with a 1m hole
        let gridBounds = {L: 0, R: 0, U: 0, D: 0};
        let turtle = {x: 0, y: 0};

        const updateGridBounds = (end) => {
            gridBounds.D = Math.min(gridBounds.D, end.x);
            gridBounds.U = Math.max(gridBounds.U, end.x);
            gridBounds.L = Math.min(gridBounds.L, end.y);
            gridBounds.R = Math.max(gridBounds.R, end.y);

            turtle = {x: end.x, y: end.y};
        };
        digPlan.forEach(instruction => {    
            if(instruction.direction === 'L')
                updateGridBounds({x: turtle.x, y: turtle.y-instruction.steps});
            if(instruction.direction === 'R')
                updateGridBounds({x: turtle.x, y: turtle.y+instruction.steps});
            if(instruction.direction === 'U')
                updateGridBounds({x: turtle.x-instruction.steps, y: turtle.y});
            if(instruction.direction === 'D')
                updateGridBounds({x: turtle.x+instruction.steps, y: turtle.y});
        });

        // Adding 1 to include zero index
        let grid = Array(gridBounds.U-gridBounds.D+1)
            .fill()
            .map(() => Array(gridBounds.R-gridBounds.L+1).fill('.'));

        console.log('Grid size found');
        //console.log(grid.map(row => row.join('')).join('\n'));

        // Find where the origin is
        turtle = {x: grid.length-1-gridBounds.U, y: grid[0].length-1-gridBounds.R};
        grid[turtle.x][turtle.y] = '#';

        console.log('Origin found');
        //console.log(grid.map(row => row.join('')).join('\n'));
        
        // Start digging out the trenches
        const createTrench = (end) => {
            // Vertical
            const vertSteps = Math.abs(end.x-turtle.x);
            const replaceVertFrom = Math.min(turtle.x+1, end.x);
            for(let i = replaceVertFrom; i < replaceVertFrom+vertSteps; i++) {
                grid[i].splice(turtle.y, 1, '#');
            }

            // Horisontal
            const horSteps = Math.abs(end.y-turtle.y);
            const replaceHorFrom = Math.min(turtle.y+1, end.y);
            Array.prototype.splice.apply(grid[turtle.x], [replaceHorFrom, horSteps].concat(Array(horSteps).fill('#'))); // how does this work!?

            turtle = {x: end.x, y: end.y};
        };
        digPlan.forEach(instruction => {    
            if(instruction.direction === 'L')
                createTrench({x: turtle.x, y: turtle.y-instruction.steps});
            if(instruction.direction === 'R')
                createTrench({x: turtle.x, y: turtle.y+instruction.steps});
            if(instruction.direction === 'U')
                createTrench({x: turtle.x-instruction.steps, y: turtle.y});
            if(instruction.direction === 'D')
                createTrench({x: turtle.x+instruction.steps, y: turtle.y});
        });

        console.log('Trenches/outlines of pool found');
        //console.log(grid.map(row => row.join('')).join('\n'));

        // Fill in the pool
        turtle = {x: grid.length-1-gridBounds.U, y: grid[0].length-1-gridBounds.R};
        let prevPos = {x: grid.length-1-gridBounds.U+1, y: grid[0].length-1-gridBounds.R};
        const step = (prev, currPos) => {
            // Always fill the local right side from currPos to the next #
            // BUG: does not fill both sides when currPos is a corner
            // Right
            if(prev.y < currPos.y) {
                for(let i = currPos.x + 1; i < grid.length; i++) {
                    if(grid[i][currPos.y] === '#')
                        break;
                    grid[i][currPos.y] = 'x';
                }
            }
            // Left
            if(prev.y > currPos.y) {
                for(let i = currPos.x - 1; i >= 0; i--) {
                    if(grid[i][currPos.y] === '#')
                        break;
                    grid[i][currPos.y] = 'x';
                }
            }
            // Up
            if(prev.x > currPos.x) {
                for(let i = currPos.y + 1; i < grid[currPos.x].length; i++) {
                    if(grid[currPos.x][i] === '#')
                        break;
                    grid[currPos.x][i] = 'x';
                }
            }
            // Down
            if(prev.x < currPos.x) {
                for(let i = currPos.y - 1; i >= 0; i--) {
                    if(grid[currPos.x][i] === '#')
                        break;
                    grid[currPos.x][i] = 'x';
                }
            }
            
            // Find next step and update turtle to next pos
            let nextPos = {x: currPos.x, y: currPos.y};
            // Up
            if(grid[nextPos.x - 1] && grid[nextPos.x - 1][nextPos.y] === '#' && !(prev.x === nextPos.x - 1 && prev.y === nextPos.y)) {
                nextPos.x = nextPos.x - 1;
            }
            // Down
            else if(grid[nextPos.x + 1] && grid[nextPos.x + 1][nextPos.y] === '#' && !(prev.x === nextPos.x + 1 && prev.y === nextPos.y)) {
                nextPos.x = nextPos.x + 1;
            }
            // Left
            else if(grid[nextPos.x][nextPos.y - 1] === '#' && !(prev.x === nextPos.x && prev.y === nextPos.y - 1)) {
                nextPos.y = nextPos.y - 1;
            }
            // Right
            else if(grid[nextPos.x][nextPos.y + 1] === '#' && !(prev.x === nextPos.x && prev.y === nextPos.y + 1)) {
                nextPos.y = nextPos.y + 1;
            }

            return [currPos, nextPos];
        };
        do {
            [prevPos, turtle] = step(prevPos, turtle);
        } while (!(turtle.x === grid.length-1-gridBounds.U && turtle.y === grid[0].length-1-gridBounds.R));

        console.log('Pool found');
        //console.log(grid.map(row => row.join('')).join('\n'));

        for(let i = 0; i < grid.length; i++) {
            for(let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === 'x')
                    grid[i][j] = '#';
            }
        }
        console.log('Pool dugged out');
        //console.log(grid.map(row => row.join('')).join('\n'));

        // Count sqaure meters
        console.log('Square meters:', grid.reduce((squares, row) => squares + row.reduce((meters, cell) => cell === '#' ? meters + 1 : meters, 0), 0));

    } catch (err) {
        console.log(err);
    }
}
example();