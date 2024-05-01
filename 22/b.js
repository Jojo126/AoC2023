const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });
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

        // Determine connections between bricks
        let under = {}; // {this: [bricks resting on top of this]}
        let above = {}; // {this: [bricks that this is resting on]}
        bricks.forEach(brick => {
            under[brick.name] = [];
            above[brick.name] = [];
            for(let y = brick.start.y; y <= brick.end.y; y++) {
                for(let x = brick.start.x; x <= brick.end.x; x++) {
                    if(matrix[brick.start.z-1][y][x] === '-') {
                        above = {...above, [brick.name]: ['-']};
                        break;
                    }
                    else if(matrix[brick.start.z-1][y][x] !== '.') {
                        if(under[matrix[brick.start.z-1][y][x]] === undefined) {
                            under[matrix[brick.start.z-1][y][x]] = [brick.name];
                        } else {
                            under[matrix[brick.start.z-1][y][x]] = [...under[matrix[brick.start.z-1][y][x]], brick.name]
                        }
                        above[brick.name] = [...above[brick.name], matrix[brick.start.z-1][y][x]];
                    }
                }
            }
        });
        //console.log({under, above});

        // Get sum of number of chained bricks that will fall for each disintegrated brick
        const result = Object.keys(under).reduce((acc, brickName) => {
            let removedBricks = [brickName];
            let queue = [...under[brickName]];
            
            const causeChainReaction = brick => {
                // Chainreaction will continue if ALL bricks under this brick has been removed/fell
                if(above[brick]?.every(brickBelow => removedBricks.some(removedBrick => removedBrick === brickBelow))) {
                    removedBricks.push(brick);
                    removedBricks = removedBricks.filter((value,index,array) => array.indexOf(value) === index);
                    queue = [...queue, ...under[brick]].filter((value,index,array) => array.indexOf(value) === index);
                }
            }

            while(queue.length > 0) {
                const nextInLine = queue.shift();
                causeChainReaction(nextInLine);
            }

            return acc + removedBricks.length-1; // Do not count the disintegrated brick
        }, 0);
        console.log(result);

    } catch (err) {
        console.log(err);
    }
}
example();