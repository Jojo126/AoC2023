const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });
        
        const map = input.split('\r\n');

        const STEPS = 64;
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
        //console.log(elfPosition)

        // Using two lists to iterate over current positions to next while not adding any duplicates
        let positions = [[elfPosition.x, elfPosition.y]];
        for(let step = 1; step <= STEPS; step++) {
            let newPositions = [];

            positions.forEach(position => {
                // West
                if(!newPositions.some(newPos => newPos[0] === position[0] && newPos[1] === position[1]-1) && position[1]-1 >= 0 && map[position[0]][position[1]-1] !== '#') {
                    newPositions.push([position[0], position[1]-1]);
                }
                // East
                if(!newPositions.some(newPos => newPos[0] === position[0] && newPos[1] === position[1]+1) && position[1]+1 < map[position[0]].length && map[position[0]][position[1]+1] !== '#') {
                    newPositions.push([position[0], position[1]+1]);
                }
                // North
                if(!newPositions.some(newPos => newPos[0] === position[0]-1 && newPos[1] === position[1]) && position[0]-1 >= 0 && map[position[0]-1][position[1]] !== '#') {
                    newPositions.push([position[0]-1, position[1]]);
                }
                // South
                if(!newPositions.some(newPos => newPos[0] === position[0]+1 && newPos[1] === position[1]) && position[0]+1 < map.length && map[position[0]+1][position[1]] !== '#') {
                    newPositions.push([position[0]+1, position[1]]);
                }
            });
            
            positions = newPositions;
        }

        console.log(positions.length)

        /*
        // Print map with possible positions for elf to end up at
        positions.forEach(position => {
            let temp = map[position[0]].split('');
            temp.splice(position[1], 1, 'O');
            map[position[0]] = temp.join('');
        })
        map.forEach(row => console.log(row))
        */

    } catch (err) {
        console.log(err);
    }
}
example();