const fs = require('node:fs/promises');

async function example() {
    try {
        let input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });

        /* Part 1 */
        /*
        let cards = input.split('\n').map(line => line.split(':').at(-1));
        cards = cards.map(card => {
            return {
                winning: card.split('|')[0].split(' ').filter(number => number !== '').map(number => parseInt(number)), 
                own: card.split('|')[1].split(' ').filter(number => number !== '').map(number => parseInt(number))
            };
        });

        cards = cards.map(card => {
            return {...card, matches: card.winning.filter(winning => card.own.some(own => own === winning))};
        })

        cards = cards.map(card => {
            return {...card, points: card.matches.length > 0 ? Math.pow(2, (card.matches.length-1)) : 0};
        });

        console.log(cards.reduce((sum,card) => sum += card.points, 0))
        */

        /* Part 2 */

        let cards = input.split('\n').map(line => line.split(':').at(-1));
        cards = cards.map(card => {
            return {
                winning: card.split('|')[0].split(' ').filter(number => number !== '').map(number => parseInt(number)), 
                own: card.split('|')[1].split(' ').filter(number => number !== '').map(number => parseInt(number))
            };
        });

        cards = cards.map(card => {
            return {...card, matches: card.winning.filter(winning => card.own.some(own => own === winning))};
        })
        
        let sumNumCards = 0;
        const recursion = (cardIndex) => {
            if(!cards.at(cardIndex)) {
                return;
            }
            sumNumCards++;
            const wins = cards[cardIndex].matches.length;
            for(let i = cardIndex + 1; i < cardIndex + 1 + wins; i++) {   
                recursion(i);
            }
        }
        for(let i = 0; i < cards.length; i++) {   
            recursion(i);
        }

        console.log(sumNumCards)

    } catch (err) {
        console.log(err);
    }
}
example();