/* Part 1 */

const input = `Time:      7  15   30
Distance:  9  40  200`;


const races = [
    {time: 7, distance: 9},
    {time: 15, distance: 40},
    {time: 30, distance: 200}
];

races.map(race => {
    let possibleRecord = 0;
    for(let i = 0; i < race.time; i++) {
        if((race.time - i) * i > race.distance) {
            possibleRecord++;
        }
    }
    race.records = possibleRecord;
});

console.log(races.reduce((acc,race) => acc *= race.records, 1))
