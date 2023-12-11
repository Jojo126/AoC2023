/* Part 1 */

const input = `Time:        51     69     98     78
Distance:   377   1171   1224   1505`;


const races = [
    {time: 51, distance: 377},
    {time: 69, distance: 1171},
    {time: 98, distance: 1224},
    {time: 78, distance: 1505}
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
