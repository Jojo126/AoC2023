const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });

        let rows = input.split('\r\n').map(row => {
            let temp = row.split(' ');
            temp[1] = temp[1].split(',').map(num => parseInt(num));
            return temp;
        });

        let arrangements = 0;
        rows.forEach(row => {
            // Get all possible permutations
            let permutations = [];
            const getAllPermutations = (prev = '', input = '') => {
                if(!Array.from(input).some(char => char === '?')) {
                    if(permutations.every(permutation => permutation !== prev.input))
                        permutations.push(prev+input);
                    return;
                }
                prev = prev + input.substring(0, input.indexOf('?'));
                
                getAllPermutations(prev + '#', input.substring(input.indexOf('?')+1));
                getAllPermutations(prev + '.', input.substring(input.indexOf('?')+1));
            };
            getAllPermutations('', row[0])
            
            // Get all permutations that follow the pattern
            let regexGroups = row[1].map((group) => `(#|\\?){${group}}`);
            let regex = new RegExp(`^(\\.|\\?)*${regexGroups.join('(\\.|\\?)+')}(\\.|\\?)*$`,'g');
            const matches = permutations.filter(permutation => permutation.match(regex));
            arrangements += matches.length;
        });
        console.log(arrangements)
        
    } catch (err) {
        console.log(err);
    }
}
example();