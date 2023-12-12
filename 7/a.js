const fs = require('node:fs/promises');

async function example() {
    try {
        let input = await fs.readFile('./input.txt', { encoding: 'utf8' });
        
        const strengthOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        let games = input.split('\n').map(hand => {
            return {
                org: hand.trim().split(' ')[0],
                cards: Array.from(hand.trim().split(' ')[0]).sort((a,b) => strengthOrder.indexOf(a) - strengthOrder.indexOf(b)),
                bid: parseInt(hand.trim().split(' ')[1])
            };
        });

        // Get type (strength)
        games.map(game => {
            let counts = {};
            game.cards.forEach(x => counts[x] = (counts[x] || 0) + 1);
            let pattern = Object.values(counts).sort((a,b) => a-b);
            if(JSON.stringify(pattern) === JSON.stringify([5]))
                game.typeStrength = 6;
            else if(JSON.stringify(pattern) === JSON.stringify([1,4]))
                game.typeStrength = 5;
            else if(JSON.stringify(pattern) === JSON.stringify([2,3]))
                game.typeStrength = 4;
            else if(JSON.stringify(pattern) === JSON.stringify([1,1,3]))
                game.typeStrength = 3;
            else if(JSON.stringify(pattern) === JSON.stringify([1,2,2]))
                game.typeStrength = 2;
            else if(JSON.stringify(pattern) === JSON.stringify([1,1,1,2]))
                game.typeStrength = 1;
            else if(JSON.stringify(pattern) === JSON.stringify([1,1,1,1,1]))
                game.typeStrength = 0;
            return game;
        });

        games.sort((a,b) => {
            if(a.typeStrength !== b.typeStrength) {
                return a.typeStrength - b.typeStrength;
            } 
            else {
                for(let i = 0; i < Array.from(a.org).length; i++) {
                    let aCard = Array.from(a.org)[i];
                    let bCard = Array.from(b.org)[i];
                    if(aCard !== bCard) {
                        return strengthOrder.indexOf(bCard)-strengthOrder.indexOf(aCard);
                    }
                }
            }
        });

        console.log(games.reduce((acc, game, i) => acc += game.bid * (i+1), 0));

    } catch (err) {
        console.log(err);
    }
}
example();