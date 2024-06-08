const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        const bricks = input.split('\r\n').map((brick, index) => {
            const endpoints = brick.split('~').map(coord => {
                const vals = coord.split(',');
                return {
                    x: Number.parseInt(vals[0]),
                    y: Number.parseInt(vals[1]),
                    z: Number.parseInt(vals[2])
                };
            });
            return {
                name: String.fromCharCode(index+65), 
                start: endpoints[0], 
                end: endpoints[1]
            };
        });
        //console.log(bricks);

        // Get matrix size
        let maxX = 0;
        let maxY = 0;
        let maxZ = 0;
        bricks.forEach(brick => {
            if(maxX < brick.start.x)
                maxX = brick.start.x;
            if(maxX < brick.end.x)
                maxX = brick.end.x;
            if(maxY < brick.start.y)
                maxY = brick.start.y;
            if(maxY < brick.end.y)
                maxY = brick.end.y;
            if(maxZ < brick.start.z)
                maxZ = brick.start.z;
            if(maxZ < brick.end.z)
                maxZ = brick.end.z;
        });
        //console.log(maxX, maxY, maxZ);
        
        // Get empty matrix
        // matrix[z][y][x]
        let matrix = [];
        for(let z = 0; z <= maxZ; z++) {
            matrix.push([]);
            for(let y = 0; y <= maxY; y++) {
                matrix[z].push([]);
                for(let x = 0; x <= maxX; x++) {
                    matrix[z][y].push('.');
                }
            }   
        }

        // Mark z=0 as occupied
        matrix[0].map(column => column.fill('-'));
        
        // Assign bricks to matrix cells
        bricks.forEach(brick => {
            for(let x = brick.start.x; x <= brick.end.x; x++) {
                matrix[brick.start.z][brick.start.y][x] = brick.name;
            }
            for(let y = brick.start.y; y <= brick.end.y; y++) {
                matrix[brick.start.z][y][brick.start.x] = brick.name;
            }
            for(let z = brick.start.z; z <= brick.end.z; z++) {
                matrix[z][brick.start.y][brick.start.x] = brick.name;
            }
        });
       
        // Move all bricks down until reached a settled position starting from bottom
        bricks.sort((a, b) => a.start.z - b.start.z);
        bricks.map(brick => {
            let isFalling = true;
            while(isFalling) {
                for(let y = brick.start.y; y <= brick.end.y; y++) {
                    for(let x = brick.start.x; x <= brick.end.x; x++) {
                        if(matrix[brick.start.z-1][y][x] !== '.') {
                            isFalling = false;
                            break;
                        }
                    }
                }
                if(isFalling) {
                    for(let z = brick.start.z; z <= brick.end.z; z++) {
                        for(let y = brick.start.y; y <= brick.end.y; y++) {
                            for(let x = brick.start.x; x <= brick.end.x; x++) {
                                let brickName = matrix[z][y][x];
                                matrix[z-1][y][x] = brickName;
                                matrix[z][y][x] = '.';
                            }
                        }
                    }
                    brick.start.z--;
                    brick.end.z--;
                }
            }
            return brick;
        });

        const isRestingOnOtherBrick = (brickName, blockingBrick) => {
            for(let by = blockingBrick.start.y; by <= blockingBrick.end.y; by++) {
                for(let bx = blockingBrick.start.x; bx <= blockingBrick.end.x; bx++) {
                    let restingOnCell = matrix[blockingBrick.start.z-1][by][bx];
                    if(restingOnCell !== '.' && restingOnCell !== brickName) {
                        return true;
                    }
                }
            }
            return false;
        };

        // Check which bricks can be safely disintegrated
        let sumSafelyRemovedBricks = 0;
        bricks.forEach(brick => {
            let canSafelyBeRemoved = true;
            let brickName = brick.name;

            // Check every cell on top of current brick it there is a brick resting on top of this brick
            for(let y = brick.start.y; y <= brick.end.y; y++) {
                for(let x = brick.start.x; x <= brick.end.x; x++) {
                    let cellAbove = matrix[brick.end.z+1][y][x];

                    // If another brick is laying on top
                    // Assume it can't be removed unless that brick also rests on top of another brick
                    if(cellAbove !== '.' && cellAbove !== brickName) {
                        // This brick is currently blocking
                        let blockingBrick = bricks.find(x => x.name === cellAbove);
                        // Check all cells below the blocking brick
                        canSafelyBeRemoved = isRestingOnOtherBrick(brickName, blockingBrick, cellAbove);
                        if(!canSafelyBeRemoved)
                            break;
                    }
                }
                if(!canSafelyBeRemoved)
                    break;
            }

            if(canSafelyBeRemoved) {
                sumSafelyRemovedBricks++;
            }
        });

        console.log(sumSafelyRemovedBricks);

    } catch (err) {
        console.log(err);
    }
}
example();