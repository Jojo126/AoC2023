const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        
        // Parse workflows and parts
        let [workflows, parts] = input.split('\r\n\r\n');
        
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
        
        parts = parts
            .split('\r\n')
            .map(part => {
                return Object.fromEntries(
                    new Map(
                        part.substring(1,part.length-1)
                            .split(',')
                            .map(prop => {
                                let vals = prop.split('=');
                                vals[1] = Number.parseInt(vals[1]);
                                return vals;
                            })
                    )
                );
            });

        // Filter to only acceptet parts
        const goThroughWorkflow = (workflowName, part) => {
            if(workflowName === 'A') return true;
            if(workflowName === 'R') return false;

            // Go trough each instruction in workflow until a redirect
            for(let i = 0; i < workflows[workflowName]?.length; i++) {
                const instruction = workflows[workflowName][i];

                // Find redirect
                if(instruction?.condition) {
                    const meetsLessThanCondition = instruction?.condition.operator === '<' && part[instruction?.condition.category] < instruction?.condition.number;
                    const meetsMoreThanCondition = instruction?.condition.operator === '>' && part[instruction?.condition.category] > instruction?.condition.number;
                    if(meetsLessThanCondition || meetsMoreThanCondition)
                        return goThroughWorkflow(instruction?.redirect, part);
                }
                else if(instruction?.redirect === 'A')
                    return true;
                else if (instruction?.redirect === 'R')
                    return false;
                else if(instruction?.redirect)
                    return goThroughWorkflow(instruction?.redirect, part);
            }
        };
        parts = parts.filter(part => {
            return goThroughWorkflow('in', part);
        });

        // Sum for final rating
        const rating = parts.reduce((acc, curr) => {
            return acc + curr.x + curr.m + curr.a + curr.s;
        }, 0)
        console.log(rating);

    } catch (err) {
        console.log(err);
    }
}
example();