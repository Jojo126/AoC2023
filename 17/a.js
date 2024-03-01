const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        
        const grid = input.split('\r\n').map(row => row.split('').map(char => Number.parseInt(char)));
        const start = {
            x: 0, 
            y: 0
        };
        const goal = {
            x: grid.length-1, 
            y: grid[0].length-1
        };

        const getManhattanDist = (coords, end) => {
            return Math.abs(coords.x - end.x) + Math.abs(coords.y - end.y);
        };
        const isGoal = coord => {
            return coord.x === goal.x && coord.y === goal.y;
        };
        const evaluateSuccessorNode = (q, coord, dir) => {
            let steps = 1;
            if(q.dir === dir)
                steps += q.steps;
            
            if(isGoal(coord)) {
                closedList.push(q);
                return false;
            }

            const g = q.cost.g + grid[coord.x][coord.y];
            const h = getManhattanDist(coord, goal);
            const f = g + h + steps;
            
            // Skip if worse path to this node than previously found
            // Uppdatera gamla till billigare om hittar ny billigare istället för att lägga till ny?
            const inOpenList = openList.some(node => 
                node.dir === dir && 
                node.steps === steps && 
                node.coord.x === coord.x && 
                node.coord.y === coord.y && 
                node.cost.f <= f
            );
            // Skip if worse path to this node than previously found
            const inClosedList = closedList.some(node => 
                node.dir === dir && 
                node.steps === steps && 
                node.coord.x === coord.x && 
                node.coord.y === coord.y &&
                node.cost.f <= f
            );
            if(!inOpenList && !inClosedList) {
                openList.push({
                    coord: coord,
                    parent: q,
                    dir: dir,
                    steps: steps,
                    cost: {
                        f: f, 
                        g: g,
                        h: h
                    }
                });
            }
            return true;
        };

        let openList = [{
            coord: start, 
            dir: null,
            steps: 0,
            cost: {
                f: 0, 
                g: 0,
                h: getManhattanDist(start, goal)
            }
        }];
        const closedList = [];
        
        while(openList.length > 0) {
            const q = openList.reduce((minCost, node) => {
                return minCost?.cost?.f < node.cost.f ? minCost : node;
            }, null);
            const qIndex = openList.findIndex(node => JSON.stringify(node) === JSON.stringify(q));
            openList.splice(qIndex, 1);

            // North
            const sameDirectionNorth = q.dir === 'north' && q.steps === 3;
            if(q.dir !== 'south' && q.coord.x - 1 >= 0 && !sameDirectionNorth) {
                const coord = {
                    x: q.coord.x - 1,
                    y: q.coord.y
                };

                if(!evaluateSuccessorNode(q, coord, 'north'))
                    break;
            }
            // South
            const sameDirectionSouth = q.dir === 'south' && q.steps === 3;
            if(q.dir !== 'north' && q.coord.x + 1 <= grid.length - 1 && !sameDirectionSouth) {
                const coord = {
                    x: q.coord.x + 1, 
                    y: q.coord.y
                }

                if(!evaluateSuccessorNode(q, coord, 'south'))
                    break;
            }
            // West
            const sameDirectionWest = q.dir === 'west' && q.steps === 3;
            if(q.dir !== 'east' && q.coord.y - 1 >= 0 && !sameDirectionWest) {
                const coord = {
                    x: q.coord.x,
                    y: q.coord.y - 1
                };
                
                if(!evaluateSuccessorNode(q, coord, 'west'))
                    break;
            }
            // East
            const sameDirectionEast = q.dir === 'east' && q.steps === 3;
            if(q.dir !== 'west' && q.coord.y + 1 <= grid[q.coord.x].length - 1 && !sameDirectionEast) {
                const coord = {
                    x: q.coord.x, 
                    y: q.coord.y + 1
                };
                
                if(!evaluateSuccessorNode(q, coord, 'east'))
                    break;
            }

            closedList.push(q);
        }
        console.log('finished search')

        // Final path:
        let backtrackingNode = closedList
            .filter(node => (node.coord.x === goal.x-1 && node.coord.y === goal.y) || (node.coord.x === goal.x && node.coord.y === goal.y-1))
            .reduce((minCost, node) => minCost?.cost?.f <= node.cost?.f ? minCost : node, null);
        console.log('back', goal, '\t', {f: backtrackingNode.cost.g + grid[goal.x][goal.y], g: backtrackingNode.cost.g + grid[goal.x][goal.y], h: getManhattanDist(goal, goal)});
        while(backtrackingNode?.parent) {
            console.log('back', backtrackingNode.coord, '\t', backtrackingNode.cost, '\t', backtrackingNode.steps, backtrackingNode.dir)
            backtrackingNode = backtrackingNode.parent;
        }
        console.log('back', closedList.at(0).coord, '\t', {f: 0, g: 0, h: getManhattanDist(start, goal)}, '\t\t', 0, closedList.at(0).dir);
        console.log(openList.length)

    } catch (err) {
        console.log(err);
    }
}
example();