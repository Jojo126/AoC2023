const fs = require('node:fs/promises');

const getBoxNumber = (label) => {
    return Array.from(label).reduce((currentValue, char) => {
        return ((currentValue + char.charCodeAt()) * 17) % 256;
    }, 0);
};

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        
        // Get lenses from steps
        let lenses = input.split(',').map(step => {
            if(step.includes('-')) {
                return {
                    label: step.substring(0, step.length-1),
                    operation: '-',
                    box: getBoxNumber(step.substring(0, step.length-1))
                };
            }
            else if(step.includes('=')) {
                return {
                    label: step.split('=')[0],
                    operation: '=',
                    focalLength: step.split('=')[1],
                    box: getBoxNumber(step.split('=')[0])
                };
            }
            else
                console.error('Why am I here? D:');
        });

        // Get empty boxes
        let boxes = Array(256).fill(undefined).map((val, index) => {
            return {
                id: index,
                lenses: []
            };
        });

        // Sort lenses into boxes
        lenses.forEach(lens => {
            if(lens.operation == '=') {
                if(boxes[lens.box].lenses.some(boxLens => boxLens.label === lens.label))
                    boxes[lens.box].lenses[boxes[lens.box].lenses.findIndex(boxLens => boxLens.label === lens.label)].focalLength = lens.focalLength;
                else
                    boxes[lens.box].lenses.push(lens);
            }
            else if(lens.operation == '-')
                boxes[lens.box].lenses = boxes[lens.box].lenses.filter(boxLens => boxLens.label !== lens.label);
            else
                console.error('I really should not be here (⊙_⊙;)');
        });

        // Get total focusing power
        const res = boxes.reduce((acc, box) => {
            return acc + box.lenses.reduce((lensAcc, lens, index) => {
                return lensAcc + (1 + box.id) * (index + 1) * lens.focalLength;
            }, 0);
        }, 0);

        console.log(res);

    } catch (err) {
        console.log(err);
    }
}
example();