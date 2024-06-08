const fs = require('node:fs/promises');

async function example() {
    try {
        let input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        const strengthOrder = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

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
            game.cards.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
            
            let pattern = Object.values(counts).sort((a,b) => a-b);
            if(!counts['J']) {
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
            } else {
                let newCounts = {};
                let filterd = game.cards.filter(card => card !== 'J')
                filterd.forEach(x => { newCounts[x] = (newCounts[x] || 0) + 1; });

                if(counts['J'] >= 4 || Object.values(newCounts).length === 1)
                    game.typeStrength = 6;
                else if((counts['J'] === 2 || counts['J'] === 3) && Object.values(newCounts).length === 2) // [X,Y,J,J,J] eller // [X,X,Y,J,J]
                    game.typeStrength = 5;
                else if(counts['J'] === 2 && Object.values(newCounts).length === 3) // [X,Y,Z,J,J]
                    game.typeStrength = 3;
                else if(counts['J'] === 1) {
                    if(Object.values(newCounts).length === 4)
                        game.typeStrength = 1; // [X,Y,Z,W,J]
                    else if(Object.values(newCounts).length === 3)
                        game.typeStrength = 3; // [X,X,Y,W,J]
                    else if(Object.values(newCounts).length === 2) {
                        if(JSON.stringify(Object.values(newCounts).sort((a,b) => a-b)) === JSON.stringify([1,3]))
                            game.typeStrength = 5; // [X,X,X,Y,J] -> 5
                        else if(JSON.stringify(Object.values(newCounts).sort((a,b) => a-b)) === JSON.stringify([2,2]))
                            game.typeStrength = 4; // [X,X,Y,Y,J] -> 4
                        else
                            console.log('Oops, something must have gone very bad :O')
                    }
                    else
                        console.log('Oops, something must have gone very bad :O')
                }
                else
                    console.log('Oops, something must have gone very bad :O')
            }
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