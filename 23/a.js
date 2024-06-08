const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        const map = input.split('\r\n');
        //console.log(map);

        const step = position => {
            let nextPositions = [];
            // Left
            const leftPosition = map[position.x]?.at(position.y-1);
            if(position.direction !== 'R' && leftPosition && leftPosition !== '#' && leftPosition !== '>')
                nextPositions.push({x: position.x, y: position.y-1, direction: 'L'});
            // Right
            const rightPosition = map[position.x]?.at(position.y+1);
            if(position.direction !== 'L' && rightPosition && rightPosition !== '#' && rightPosition !== '<')
                nextPositions.push({x: position.x, y: position.y+1, direction: 'R'});
            // Top
            const topPosition = map[position.x-1]?.at(position.y);
            if(position.direction !== 'D' && topPosition && topPosition !== '#' && topPosition !== 'v')
                nextPositions.push({x: position.x-1, y: position.y, direction: 'U'});
            // Bottom
            const bottomPosition = map[position.x+1]?.at(position.y);
            if(position.direction !== 'U' && bottomPosition && bottomPosition !== '#' && bottomPosition !== '^')
                nextPositions.push({x: position.x+1, y: position.y, direction: 'D'});
            return nextPositions;
        }
        
        let positions = [{x: 0, y: 1, direction: 'D'}];
        let i = 0;
        let longestTourSteps = 0;
        while(positions.length > 0) {
            if(positions.some(position => position.x === map.length-1 && position.y === map[map.length-1].length-2)) {
                longestTourSteps = i;
            }
                
            let newPositions = [];
            positions.forEach(nextPosition => {
                newPositions = [...newPositions, ...step(nextPosition)];
            });
            positions = newPositions;
            i++;
        }
        console.log(longestTourSteps)

    } catch (err) {
        console.log(err);
    }
}
example();