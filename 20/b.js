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
        let hasSentLowPulseToModule = false;
        const sendPulse = (queueEntry, endPoint) => {
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
            if(queueEntry.next === endPoint && queueEntry.freq === 'low') {
                hasSentLowPulseToModule = true;
                return;
            }

            queue = queue.concat(
                modules[queueEntry.next].nextModules.map(next => {
                    return {prev: queueEntry.next, freq: outgoingFrequency, next: next};
                })
            );
        };

        const pushButton = endPoint => {
            queue = [{prev: 'button', freq: 'low', next: 'broadcaster'}];
            while(queue.length > 0) {
                let currModule = queue.shift();
                if(modules[currModule.next]) // e.g. output is not a module
                    sendPulse(currModule, endPoint);
                if(hasSentLowPulseToModule) 
                    return;
            }
        }

        // From drawing the input as a graph, realized it repeats for modules &xc, &ct, &kp, &ks
        const cyclesEndpoints = ['xc', 'ct', 'kp', 'ks'];
        const cycleButtonPushes = cyclesEndpoints.map(endPoint => {
            modules = structuredClone(INITAL_STATE);
            let buttonPresses = 0;
            queue = [];
            hasSentLowPulseToModule = false;
            while(!hasSentLowPulseToModule) {
                highs = 0;
                lows = 0;
                path = '';
                pushButton(endPoint);
                if(JSON.stringify(modules) === JSON.stringify(INITAL_STATE))
                    break;
                buttonPresses++;
            }
            return buttonPresses;
        })
        
        // LCM to get least amount of pushes
        /*
        const getPrimaryNumbers = (val) => {
            let comps = [];
            let i = 2;
            let num = val;
            while(i <= num) {
                if(num % i === 0) {
                    comps.push(i);
                    num /= i;
                }
                else
                    i++;
            }
            return comps;
        }
        console.log(cycleButtonPushes.map(val => getPrimaryNumbers(val))); // They all are primary numbers ¯\_(ツ)_/¯
        */
        console.log('Least button pushes:', cycleButtonPushes.reduce((total, cycle) => total * cycle, 1));

    } catch (err) {
        console.log(err);
    }
}
example();