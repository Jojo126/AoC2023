const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });
        let digPlan = input.split('\r\n').map(row => {
            const values = row.split(' ');
            return {
                direction: values[0],
                steps: Number.parseInt(values[1]),
                color: values[2].substring(1, values[2].length-1)
            };
        });
        
        // Get real instructions
        digPlan = digPlan.map(instruction => {
            let realInstruction = instruction.color;
            direction = Number.parseInt(realInstruction.at(-1));
            if(direction === 0)
                direction = 'R';
            else if(direction === 1)
                direction = 'D';
            else if(direction === 2)
                direction = 'L';
            else if(direction === 3)
                direction = 'U';

            let steps = Number('0x'+realInstruction.substring(1,realInstruction.length-1))

            return {
                direction: direction,
                steps: steps,
                realInstruction: instruction.color
            };
        });
        
        // Find all vertices for the pool
        let turtle = {x: 0, y: 0, dir: digPlan.at(0).direction};
        let vertices = [];
        if(digPlan.at(0).direction === 'L' || digPlan.at(-1).direction === 'L')
            turtle.x += 1;
        if(digPlan.at(0).direction === 'D' || digPlan.at(-1).direction === 'D')
            turtle.y += 1;
            
        vertices.push({x: turtle.x, y: turtle.y});

        const updateGridBounds = (end, nextDir) => {
            const currDir = turtle.dir;

            turtle = {x: end.x, y: end.y, dir: nextDir};
            let vertex = {x: end.x, y: end.y};
            if(currDir === 'L' || nextDir === 'L')
                vertex.x += 1;
            if(currDir === 'D' || nextDir === 'D')
                vertex.y += 1;

            vertices.push(vertex);
        };
        for(let i = 0; i < digPlan.length; i++) {
            if(digPlan[i].direction === 'L') {
                updateGridBounds({x: turtle.x, y: turtle.y-digPlan[i].steps}, digPlan.at(i+1)?.direction);
            }
            else if(digPlan[i].direction === 'R') {
                updateGridBounds({x: turtle.x, y: turtle.y+digPlan[i].steps}, digPlan.at(i+1)?.direction);
            }
            else if(digPlan[i].direction === 'U') {
                updateGridBounds({x: turtle.x-digPlan[i].steps, y: turtle.y}, digPlan.at(i+1)?.direction);
            }
            else if(digPlan[i].direction === 'D') {
                updateGridBounds({x: turtle.x+digPlan[i].steps, y: turtle.y}, digPlan.at(i+1)?.direction);
            }
        }

        // Get area using the shoelace formula
        let area = 0;
        for(let i = 0; i < vertices.length-1; i++) {
            area += vertices.at(i).x * (vertices.at(i+1).y - vertices.at(i-1).y);
        }
        console.log(Math.abs(area)/2)

        return;

    } catch (err) {
        console.log(err);
    }
}
example();