const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        
        // Parse modules
        let modules = input.split('\r\n').reduce((acc, rule) => {
            rule = rule.split('->').map(val => val.trim());
            let parsedRule = {};
            let moduleName = '';
            if(rule[0] === 'broadcaster') {
                parsedRule.moduleType = 'broadcaster';
                moduleName = rule[0];
            }
            else if(rule[0].at(0) === '%') {
                parsedRule.moduleType = 'flip-flop';
                moduleName = rule[0].substring(1, rule[0].length);
                parsedRule.toggle = 'off';
            }
            else if (rule[0].at(0) === '&') {
                parsedRule.moduleType = 'conjuction';
                moduleName = rule[0].substring(1, rule[0].length);
            }
            
            parsedRule.nextModules = rule[1].split(', ');
            
            return {...acc, [moduleName]: parsedRule};
        }, {});

        // Connect conjuction modules to their inputs
        Object.entries(modules).forEach(module => {
            if (module[1].moduleType === 'conjuction') {
                module[1].inputs = Object.fromEntries(Object.entries(modules)
                    .filter(inputModules => {
                        return inputModules[1].nextModules.some(nextModule => nextModule === module[0])
                    })
                    .map(inputModule => {
                        return [[inputModule[0]], 'low'];
                    })
                );
            }
        });

        const INITAL_STATE = structuredClone(modules);

        let queue = [];
        const sendPulse = queueEntry => {
            let module = modules[queueEntry.next];
            let outgoingFrequency = queueEntry.freq;

            if(module.moduleType === 'flip-flop') {
                if(queueEntry.freq === 'high') 
                    return;
                outgoingFrequency = module.toggle === 'on' ? 'low' : 'high';
                modules[queueEntry.next].toggle = module.toggle === 'on' ? 'off' : 'on';
            } else if (module.moduleType === 'conjuction') {
                modules[queueEntry.next].inputs[queueEntry.prev] = queueEntry.freq;

                if(Object.values(module.inputs).every(input => input === 'high'))
                    outgoingFrequency = 'low';
                else 
                    outgoingFrequency = 'high';
            }

            queue = queue.concat(
                modules[queueEntry.next].nextModules.map(next => {
                    return {prev: queueEntry.next, freq: outgoingFrequency, next: next};
                })
            );
        };

        let lows = 0;
        let highs = 0;
        const pushButton = () => {
            queue = [{prev: 'button', freq: 'low', next: 'broadcaster'}];
            while(queue.length > 0) {
                let currModule = queue.shift();
                if(currModule.freq === 'low') lows++;
                if(currModule.freq === 'high') highs++;
                //console.log(`${currModule.prev} -${currModule.freq}-> ${currModule.next}`);
                if(modules[currModule.next]) // e.g. output is not a module
                    sendPulse(currModule);
            }
        }

        let i = 0;
        while(i < 1000) {
            pushButton();
            if(JSON.stringify(modules) === JSON.stringify(INITAL_STATE))
                break;
            i++;
        }
        //console.log('Cycle repeats after', i, 'highs', highs, 'lows', lows);
        
        i = i === 0 ? 1 : i;
        lows *= Math.floor(1000/i);
        highs *= Math.floor(1000/i);
        let j = 0;
        while(j < 1000 % i) {
            pushButton();
            if(JSON.stringify(modules) === JSON.stringify(INITAL_STATE))
                break;
            j++;
        }
        console.log('Res:', lows * highs, 'Total low pulses:', lows, 'Total high pulses:', highs);

    } catch (err) {
        console.log(err);
    }
}
example();