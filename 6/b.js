/* Part 2 */

const races = [
    {time: 71530, distance: 940200}
];

const getRange = (time) => {
    // Using pq-formula to get the two solutions for this second degree equation
    // (time - pressing) * pressing = races[0].distance <=> pressing^2 -time*pressing + races[0].distance
    let term1 = -(-time/2);
    let term2 = Math.sqrt((-time/2)*(-time/2)-races[0].distance);
    let x1 = term1 - term2;
    let x2 = term1 + term2;
    return [Math.ceil(x1), Math.floor(x2)];
};

let possibleRecords = 0;
for(let i = 0; i < 1; i++) {
    let range = getRange(races[0].time - i);
    if(!isNaN(range[0]) && !isNaN(range[1])) {
        possibleRecords += range[1]-range[0]+1; // [range0, range1] not ]range0, range1]
    }
}
console.log(possibleRecords);