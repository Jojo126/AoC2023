const fs = require('node:fs/promises');

async function example() {
    try {
        let input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });

        /* Part 2 */
        
        input = input.split('\r\n\r\n').map(group => group.split(':\r').at(-1).trim().split('\r\n'));
        seeds = input.shift()[0].split(': ').at(-1).split(' ').map(val => parseInt(val));
        const mapGroups = input.map(group => group.map(map => map.split(' ').map(value => parseInt(value))));

        let ranges = [];
        for(let seedInd = 0; seedInd < seeds.length; seedInd += 2) {
            ranges.push({
                start: seeds[seedInd], 
                end: seeds[seedInd] + seeds[seedInd+1] -1
            });
        }

        mapGroups.forEach(mapGroup => {
            for(let i = 0; i < ranges.length; i++) {
                for(let j = 0; j < mapGroup.length; j++) {
                    const mapRangeStart = mapGroup[j][1];
                    const mapRangeEnd = mapRangeStart + mapGroup[j][2];
                    const mapConversionOffset = mapGroup[j][0] - mapRangeStart;
                    // Whole range in map
                    if(mapRangeStart <= ranges[i].start && ranges[i].end <= mapRangeEnd-1) {
                        ranges[i] = {
                            start: mapConversionOffset + ranges[i].start, 
                            end: mapConversionOffset + ranges[i].end
                        };
                        break;
                    }
                    // Only start of range inside map
                    else if(mapRangeStart <= ranges[i].start && ranges[i].start <= mapRangeEnd-1) {
                        ranges.push({
                            start: mapRangeEnd, 
                            end: ranges[i].end
                        });
                        ranges[i] = {
                            start: ranges[i].start + mapConversionOffset, 
                            end: mapRangeEnd-1 + mapConversionOffset
                        };
                        break;
                    } 
                    // Only end of range inside map
                    else if(mapRangeStart <= ranges[i].end && ranges[i].end <= mapRangeEnd-1) {
                        ranges.push({
                            start: ranges[i].start, 
                            end: mapRangeStart-1
                        });
                        ranges[i] = {
                            start: mapRangeStart + mapConversionOffset, 
                            end: ranges[i].end + mapConversionOffset
                        };
                        break;
                    }
                }
            }
        });
        console.log(ranges.reduce((min,curr) => Math.min(min,curr.start), ranges[0].start));
        
    } catch (err) {
        console.log(err);
    }
}
example();