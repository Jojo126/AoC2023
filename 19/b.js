const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        
        // Parse workflows
        let [workflows, ] = input.split('\r\n\r\n');
        workflows = workflows
            .split('\r\n')
            .map(workflow => {
                let [key, steps] = workflow
                .substring(0, workflow.length-1)
                .split('{');

                steps = steps.split(',').map(step => {
                    let instructions = step.split(':');
                    if(instructions.length <= 1)
                        return { redirect: instructions[0] };
                    
                    instructions[0] = {
                        category: instructions[0].substring(0,1),
                        operator: instructions[0].substring(1,2),
                        number: Number.parseInt(instructions[0].substring(2))
                    };
                    return {
                        condition: instructions[0],
                        redirect: instructions[1]
                    };     
                });
                return [key, steps];
            });
        workflows = Object.fromEntries(new Map(workflows));

        // Filter to only acceptet parts
        let acceptableRanges = [];
        let initialRange = {
            x: [1, 4000], 
            m: [1, 4000], 
            a: [1, 4000], 
            s: [1, 4000]
        };  
        const goThroughWorkflow = (workflowName, part) => {
            let clonedPartRange = structuredClone(part);

            // Base cases
            if(workflowName === 'A') {
                acceptableRanges.push(clonedPartRange);
                return;
            }
            if(workflowName === 'R') return;

            // Go trough each instruction in workflow until a redirect
            for(let i = 0; i < workflows[workflowName]?.length; i++) {
                const instruction = workflows[workflowName][i];

                // Find redirect
                if(instruction?.condition) {
                    const meetsLessThanCondition = instruction?.condition.operator === '<' && clonedPartRange[instruction?.condition.category][0] < instruction?.condition.number;
                    const meetsMoreThanCondition = instruction?.condition.operator === '>' && clonedPartRange[instruction?.condition.category][1] > instruction?.condition.number;
                    // Condition results in a new split of range
                    let nextSplitRange = structuredClone(clonedPartRange);
                    if(meetsLessThanCondition) {                        
                        clonedPartRange[instruction?.condition.category][0] = instruction?.condition.number;
                        nextSplitRange[instruction?.condition.category][1] = instruction?.condition.number-1;
                        goThroughWorkflow(instruction?.redirect, nextSplitRange);
                    }
                    else if(meetsMoreThanCondition) {
                        clonedPartRange[instruction?.condition.category][1] = instruction?.condition.number;
                        nextSplitRange[instruction?.condition.category][0] = instruction?.condition.number+1;
                        goThroughWorkflow(instruction?.redirect, nextSplitRange);
                    }
                }
                else
                    goThroughWorkflow(instruction?.redirect, clonedPartRange);
            }
        };
        goThroughWorkflow('in', initialRange);

        // Sum the number of possible combinations
        const numPossibleCombinations = acceptableRanges.reduce((numCombinations, range) => {
            const x = range.x[1]-range.x[0]+1;
            const m = range.m[1]-range.m[0]+1;
            const a = range.a[1]-range.a[0]+1;
            const s = range.s[1]-range.s[0]+1;

            return numCombinations + x * m * a * s;
        }, 0);
        console.log(numPossibleCombinations);

    } catch (err) {
        console.log(err);
    }
}
example();