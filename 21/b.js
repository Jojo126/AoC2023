const fs = require('node:fs/promises');

async function example() {
    try {
        /*
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });
        
        const map = input.split('\r\n');
        let elfPosition;
        for(let i = 0; i < map.length; i++) {
            for(let j = 0; j < map[i].length; j++) {
                if(map[i].at(j) === 'S') {
                    elfPosition = {
                        x: i,
                        y: j
                    };
                    break;
                }
            }   
        }

        // Starting from step 65 (edge of the first map), the number of positions is increasing in a quadric pattern 
        // with every 131 steps because the edge of the map is reached and repeated after.
        // Since the amount of remaining steps is divisible with 131 without any remainder left, i.e. 
        // (26501365-65)/131 = 202300, it is possible to determine a second degree polynomial f(x) = ax^2 + bx + c 
        // and solve it for 202300 cycles to get final number positions. 
        // tl;dr f(202300) = total final positions.

        // This gives f(x) = ax^2 + bx + c where:
        for(let i = 0; i < 3; i++) {
            // Using two lists to iterate over current positions to next while not adding any duplicates
            let positions = [[elfPosition.x, elfPosition.y, 0, 0]];
            const STEPS = 65+131*i;
            for(let step = 1; step <= STEPS; step++) {
                let newPositions = [];
                
                positions.forEach(position => {
                    // West
                    // Fits in current map
                    if(position[1]-1 >= 0 && map[position[0]][position[1]-1] !== '#' && 
                        !newPositions.some(newPos => 
                            newPos[0] === position[0] && 
                            newPos[1] === position[1]-1 && 
                            newPos[2] === position[2] && 
                            newPos[3] === position[3]))
                        newPositions.push([position[0], position[1]-1, position[2], position[3]]);
                    // Moving to left adjacent map copy
                    else if (position[1]-1 < 0 && 
                        !newPositions.some(newPos => 
                            newPos[0] === position[0] && 
                            newPos[1] === map[position[0]].length-1 && 
                            newPos[2] === position[2] && 
                            newPos[3] === position[3]-1))
                        newPositions.push([position[0], map[position[0]].length-1, position[2], position[3]-1]);
                    // East
                    if(position[1]+1 < map[position[0]].length && map[position[0]][position[1]+1] !== '#' && 
                        !newPositions.some(newPos => 
                            newPos[0] === position[0] && 
                            newPos[1] === position[1]+1 && 
                            newPos[2] === position[2] && 
                            newPos[3] === position[3]))
                        newPositions.push([position[0], position[1]+1, position[2], position[3]]);
                    else if (position[1]+1 >= map[position[0]].length && 
                        !newPositions.some(newPos => 
                            newPos[0] === position[0] && 
                            newPos[1] === 0 && 
                            newPos[2] === position[2] && 
                            newPos[3] === position[3]+1))
                        newPositions.push([position[0], 0, position[2], position[3]+1]);
                    // North
                    if(position[0]-1 >= 0 && map[position[0]-1][position[1]] !== '#' && 
                        !newPositions.some(newPos => 
                            newPos[0] === position[0]-1 && 
                            newPos[1] === position[1] && 
                            newPos[2] === position[2] && 
                            newPos[3] === position[3]))
                        newPositions.push([position[0]-1, position[1], position[2], position[3]]);
                    else if (position[0]-1 < 0 && 
                        !newPositions.some(newPos => 
                            newPos[0] === map.length-1 && 
                            newPos[1] === position[1] && 
                            newPos[2] === position[2]-1 && 
                            newPos[3] === position[3]))
                        newPositions.push([map.length-1, position[1], position[2]-1, position[3]]);
                    // South
                    if(position[0]+1 < map.length && map[position[0]+1][position[1]] !== '#' && 
                        !newPositions.some(newPos => 
                            newPos[0] === position[0]+1 && 
                            newPos[1] === position[1] && 
                            newPos[2] === position[2] && 
                            newPos[3] === position[3]))
                        newPositions.push([position[0]+1, position[1], position[2], position[3]]);
                    else if (position[0]+1 >= map.length && 
                        !newPositions.some(newPos => 
                            newPos[0] === 0 && 
                            newPos[1] === position[1] && 
                            newPos[2] === position[2]+1 && 
                            newPos[3] === position[3]))
                        newPositions.push([0, position[1], position[2]+1, position[3]]);
                });
                
                positions = newPositions;
            }

            // Print map with possible positions for elf to end up at
            let mapCopy = structuredClone(map);
            let thisMapsPositions = structuredClone(positions);
            
            mapCopy = mapCopy.map(row => row+row+row)
            mapCopy = mapCopy.concat(mapCopy, mapCopy);
            thisMapsPositions.forEach(position => {
                let adjacentMaps = 1;
                let rowIndex = position[0]+(adjacentMaps+position[2])*map.length;
                let charIndex = position[1]+(adjacentMaps+position[3])*map[0].length;
                
                if(rowIndex < 0 || rowIndex >= mapCopy.length || charIndex < 0 || charIndex >= mapCopy[rowIndex].length) return;
                let temp = mapCopy[position[0]+(adjacentMaps+position[2])*map.length].split('');
                temp.splice(position[1]+(adjacentMaps+position[3])*map[position[1]].length, 1, 'O');
                mapCopy[position[0]+(adjacentMaps+position[2])*map.length] = temp.join('');
            });

            console.log(`f(${i}) = ${positions.length}`);
        }
        */
        // which can be solved to:
        // a = 15453
        // b = 15550
        // c = 3917 
        // which gives f(x) = 15453*x*x + 15550*x + 3917

        const getFinalPositions = x => 15453*x*x + 15550*x + 3917;
        console.log(getFinalPositions((26501365-65)/131));

    } catch (err) {
        console.log(err);
    }
}
example();