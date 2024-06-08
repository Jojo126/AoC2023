const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        const hailstones = input.split('\r\n').map(hailstone => {
            const [pos, vel] = hailstone.split('@');
            const posCoords = pos.split(',');
            const velCoords = vel.split(',');
            return {
                position: {
                    x: Number.parseInt(posCoords[0]),
                    y: Number.parseInt(posCoords[1]),
                    z: Number.parseInt(posCoords[2]),
                },
                velocity: {
                    x: Number.parseInt(velCoords[0]),
                    y: Number.parseInt(velCoords[1]),
                    z: Number.parseInt(velCoords[2]),
                },
            };
        });
        //console.log(hailstones);

        // Hailstone trajectories can be described as linear functions or lines since the velocities are constant.
        // y = ax + b
        // This means we can determine the intersection points betweem the trajectories by the power of math! 
        // ...and then check if those point are within the test area
        let intersections = [];
        for(let i = 0; i < hailstones.length; i++) {
            const a = hailstones[i].velocity.y / hailstones[i].velocity.x;
            const b = hailstones[i].position.y - a * hailstones[i].position.x;

            for(let j = i+1; j < hailstones.length; j++) {
                if(i !== j) {
                    const c = hailstones[j].velocity.y / hailstones[j].velocity.x;
                    const d = hailstones[j].position.y - c * hailstones[j].position.x;

                    // Lines are parallel and will never intersect
                    if(a === c) {
                        continue;
                    }

                    x = (d - b) / (a - c);
                    y = a * (d - b) / (a - c) + b;
                    //console.log('intersection point at', x, y);

                    // Check if the intersection point is valid
                    const minBound = 7;
                    const maxBound = 27;
                    //const minBound = 200000000000000;
                    //const maxBound = 400000000000000;
                    const isWithinTestArea = minBound <= x && x <= maxBound && minBound <= y && y <= maxBound;

                    // Need to make sure the point is along the part of the line that the stone will move forward on
                    const isAlongTrajectory = 
                    ((hailstones[i].velocity.x >= 0 && x >= hailstones[i].position.x) 
                    || 
                    (hailstones[i].velocity.x <= 0 && x <= hailstones[i].position.x)) 
                    && 
                    ((hailstones[i].velocity.y >= 0 && y >= hailstones[i].position.y) 
                    || 
                    (hailstones[i].velocity.y <= 0 && y <= hailstones[i].position.y))
                    && 
                    ((hailstones[j].velocity.x >= 0 && x >= hailstones[j].position.x) 
                    || 
                    (hailstones[j].velocity.x <= 0 && x <= hailstones[j].position.x)) 
                    && 
                    ((hailstones[j].velocity.y >= 0 && y >= hailstones[j].position.y) 
                    || 
                    (hailstones[j].velocity.y <= 0 && y <= hailstones[j].position.y));
                    

                    if(isWithinTestArea && isAlongTrajectory) {
                        intersections.push({i,j});
                    }
                }
            }   
        }
        console.log(intersections.length);

    } catch (err) {
        console.log(err);
    }
}
example();