const fs = require('node:fs/promises');

async function example() {
    try {
        let input = await fs.readFile('./input.txt', { encoding: 'utf8' });

        /* Part 1 */
        input = input.split('\r\n\r\n').map(group => group.split(':\r').at(-1).trim().split('\r\n'));
        seeds = input.shift()[0].split(': ').at(-1).split(' ').map(val => parseInt(val));
        const mapGroups = input.map(group => group.map(map => map.split(' ').map(value => parseInt(value))));
        seeds = seeds.map(seed => {
            mapGroups.forEach(maps => {
                for(let i = 0; i < maps.length; i++) {
                    if(maps[i][1] <= seed && seed <= maps[i][1]+maps[i][2]) {
                        seed = maps[i][0] - maps[i][1] + seed;
                        return;
                    }
                }
            });
            return seed;
        });

        console.log(seeds.reduce((min,curr) => Math.min(min,curr), seeds[0]));

    } catch (err) {
        console.log(err);
    }
}
example();