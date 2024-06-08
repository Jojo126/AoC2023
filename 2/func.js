const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const MAXRED = 12, MAXGREEN = 13, MAXBLUE = 14;

/* Part 1 */
/*
const games = input
    .split('\n')
    .map(game => { 
        const numbers = game.match(/\d+/g);
        const pulls = game
            .split(':')
            .at(-1)
            .split(';')
            .map(pull => pull.split(','));

        const formattedPulls = pulls.map(pull => {
            let parsedPull = {};
            pull.forEach(value => {
                if(value.includes('red')) {
                    parsedPull.red = parseInt(value.match(/\d+/g)[0]);
                }
                else if(value.includes('green')) {
                    parsedPull.green = parseInt(value.match(/\d+/g)[0]);
                }
                else if(value.includes('blue')) {
                    parsedPull.blue = parseInt(value.match(/\d+/g)[0]);
                }
            });
            return parsedPull;
        });

        return {
            id: parseInt(numbers.at(0)),
            pulls: formattedPulls
        }
    });

const possibleGames = games.filter(game => game.pulls.every(pull => (!pull.red || pull.red <= MAXRED) && (!pull.green || pull.green <= MAXGREEN) && (!pull.blue || pull.blue <= MAXBLUE)));

const summedIds = possibleGames.reduce((sum, game) => sum + game.id, 0);

console.log(summedIds)
*/

/* Part 2 */

const testInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const games = input
    .split('\n')
    .map(game => { 
        const numbers = game.match(/\d+/g);
        const pulls = game
            .split(':')
            .at(-1)
            .split(';')
            .map(pull => pull.split(','));

        const formattedPulls = pulls.map(pull => {
            let parsedPull = {};
            pull.forEach(value => {
                if(value.includes('red')) {
                    parsedPull.red = parseInt(value.match(/\d+/g)[0]);
                }
                else if(value.includes('green')) {
                    parsedPull.green = parseInt(value.match(/\d+/g)[0]);
                }
                else if(value.includes('blue')) {
                    parsedPull.blue = parseInt(value.match(/\d+/g)[0]);
                }
            });
            return parsedPull;
        });

        return {
            id: parseInt(numbers.at(0)),
            pulls: formattedPulls
        }
    });

const summedGamePower = games.reduce((sum, game) => {
    let minPossibleRed, minPossibleGreen, minPossibleBlue;

    game.pulls.forEach(pull => {
        if(pull.red && (!minPossibleRed || pull.red > minPossibleRed)) {
            minPossibleRed = pull.red;
        }
        if(pull.green && (!minPossibleGreen || pull.green > minPossibleGreen)) {
            minPossibleGreen = pull.green;
        }
        if(pull.blue && (!minPossibleBlue || pull.blue > minPossibleBlue)) {
            minPossibleBlue = pull.blue;
        }
    });
    
    return sum + minPossibleRed*minPossibleGreen*minPossibleBlue;
}, 0);

console.log(summedGamePower)