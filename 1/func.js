/* Part 1 */
/*
const input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const sum = input
    .split('\n')
    .map(rowString => {
        const digits = rowString.match(/\d/g); 
        const rowNumber = parseInt(digits.at(0) + digits.at(-1));
        return rowNumber;
    })
    .reduce((sum, curr) => sum += curr, 0);

console.log(sum);
*/

/* Part 2 */
const input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const sum = input
    .split('\n')
    .map(rowString => {
        // Cannot use replace() because two numbers can share letters e.g. eightwo -> 82...
        // need to see that 8 and 2 "exist simultaneously"
        // also need to be aware that they are placed next to each other -> sum with 82 later
        // need to read every row by stepping through each char and see if they match any letterd number
        // also need to realize that some chars have to be removed where its resp number has been added to maintain alignment with other numbers

        let newString = '';
        let shouldRemove = null;
        for(var i = 0; i < rowString.length; i++) {
            let remaining = rowString.slice(i);
            if(remaining.startsWith('one')) {
                newString = newString + '1';
                shouldRemove = i + 2;
            }
            else if(remaining.startsWith('two')) {
                newString = newString + '2';
                shouldRemove = i + 2;
            }
            else if(remaining.startsWith('three')) {
                newString = newString + '3';
                shouldRemove = i + 4;
            }
            else if(remaining.startsWith('four')) {
                newString = newString + '4';
                shouldRemove = i + 3;
            }
            else if(remaining.startsWith('five')) {
                newString = newString + '5';
                shouldRemove = i + 3;
            }
            else if(remaining.startsWith('six')) {
                newString = newString + '6';
                shouldRemove = i + 2;
            }
            else if(remaining.startsWith('seven')) {
                newString = newString + '7';
                shouldRemove = i + 4;
            }
            else if(remaining.startsWith('eight')) {
                newString = newString + '8';
                shouldRemove = i + 4;
            }
            else if(remaining.startsWith('nine')) {
                newString = newString + '9';
                shouldRemove = i + 3;
            }
            else {
                if(shouldRemove === null || i > shouldRemove)
                    newString = newString + rowString.charAt(i);
            }
        }

        const digits = newString?.match(/\d/g);
        const rowNumber = parseInt(digits?.at(0) + digits?.at(-1));
        return rowNumber;
    })
    .reduce((sum, curr) => sum += curr, 0);
    
console.log(sum);