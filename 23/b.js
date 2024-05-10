const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./input.txt', { encoding: 'utf8' });
        let map = input.split('\r\n');
        //console.log(map);

        // Optimizing this by mapping out a graph of all subpaths between crossings (nodes) and storing the length of those 
        // subpaths to not have to iterate over each step in a subpath later on when checking for the longest path
        
        const startPosition = {
            x: 0, 
            y: 1, 
            direction: 'D',
            steps: 0
        };
        // Double linked list for storing the graph of paths
        const nodes = {
          [startPosition.x+','+startPosition.y]: {
            x: startPosition.x,
            y: startPosition.y,
            paths: []
          }
        };

        // Map all found nodes into a graph (double linked list)
        const findNextNode = node => {
            // Take the next step in the path and check what type of cell it is
            // Counts length of each subpath
            const followPath = position => {
                // Check if found a node
                // Know from looking at the input that the crossings/nodes are always marked with slopes around
                // and that slopes are only right beside crossings
                // Also know that only '>' and 'v' slopes exists in the input
                const leftPosition = map[position.x]?.at(position.y-1);
                const rightPosition = map[position.x]?.at(position.y+1);
                const topPosition = map[position.x-1]?.at(position.y);
                const bottomPosition = map[position.x+1]?.at(position.y);
                if(leftPosition === '>' && (rightPosition === '>' || bottomPosition === 'v'))
                    return position;
                if(bottomPosition === 'v' && (rightPosition === '>' || topPosition === 'v'))
                    return position;

                // Step
                // Left
                if(position.direction !== 'R' && leftPosition && leftPosition !== '#')
                    return followPath({
                        x: position.x, 
                        y: position.y-1, 
                        direction: 'L',
                        steps: position.steps + 1
                    });
                // Right
                if(position.direction !== 'L' && rightPosition && rightPosition !== '#')
                    return followPath({
                        x: position.x, 
                        y: position.y+1, 
                        direction: 'R',
                        steps: position.steps + 1
                    });
                // Top
                if(position.direction !== 'D' && topPosition && topPosition !== '#')
                    return followPath({
                        x: position.x-1, 
                        y: position.y, 
                        direction: 'U',
                        steps: position.steps + 1
                    });
                // Bottom
                if(position.direction !== 'U' && bottomPosition && bottomPosition !== '#')
                    return followPath({
                        x: position.x+1, 
                        y: position.y, 
                        direction: 'D',
                        steps: position.steps + 1
                    });
                return position;
            };
            // Add all connections between nodes in the graph
            const connectNodes = (node, newNode) => {
                if(newNode) {
                    const fromName = node.x+','+node.y;
                    const toName = newNode.x+','+newNode.y;
                    // The new found node is already listed in graph
                    // Add the new connection in the graph entry
                    if(nodes[toName]) {
                        if(nodes[toName].paths.every(connectedNode => connectedNode.node !== fromName)) {
                            nodes[toName].paths = [
                                {
                                    node: fromName,
                                    steps: newNode.steps
                                },
                                ...nodes[toName].paths
                            ];
                        }
                        if(nodes[fromName].paths.every(connectedNode => connectedNode.node !== toName)) {
                            nodes[fromName].paths = [
                                {
                                    node: toName,
                                    steps: newNode.steps
                                },
                                ...nodes[fromName].paths
                            ];
                        }
                    }
                    // Node is completely new
                    // Create a new entry in the graph and make the connections
                    // Then continue follow the new nodes paths
                    else {
                        nodes[toName] = {
                            x: newNode.x,
                            y: newNode.y,
                            paths: [{
                                node: fromName,
                                steps: newNode.steps
                            }]
                        };
                        nodes[fromName].paths = [
                            {
                                node: toName,
                                steps: newNode.steps
                            },
                            ...nodes[fromName].paths
                        ];
                        findNextNode(newNode);
                    }
                }
            };

            // Go to next node
            const nodeName = node.x+','+node.y;
            // Left
            const leftPosition = map[node.x]?.at(node.y-1);
            if(node.direction !== 'R' && leftPosition && leftPosition !== '#') {
                const newNode = followPath({
                    x: nodes[nodeName].x, 
                    y: nodes[nodeName].y-1, 
                    direction: 'L',
                    steps: 1 // include the step taken when decided which path to follow
                });
                connectNodes(node, newNode);
            }
            // Right
            const rightPosition = map[node.x]?.at(node.y+1);
            if(node.direction !== 'L' && rightPosition && rightPosition !== '#') {
                const newNode = followPath({
                    x: nodes[nodeName].x, 
                    y: nodes[nodeName].y+1, 
                    direction: 'R',
                    steps: 1
                });
                connectNodes(node, newNode);
            }
            // Top
            const topPosition = map[node.x-1]?.at(node.y);
            if(node.direction !== 'D' && topPosition && topPosition !== '#') {
                const newNode = followPath({
                    x: node.x-1, 
                    y: node.y, 
                    direction: 'U',
                    steps: 1
                });
                connectNodes(node, newNode);
            }
            // Bottom
            const bottomPosition = map[node.x+1]?.at(node.y);
            if(node.direction !== 'U' && bottomPosition && bottomPosition !== '#') {
                const newNode = followPath({
                    x: node.x+1, 
                    y: node.y, 
                    direction: 'D',
                    steps: 1
                });
                connectNodes(node, newNode);
            }
        }
        findNextNode(startPosition);
        //console.log(nodes);

        // Go through all possible paths where the nodes does not repeat in the path using depth-first
        // Returns the longest path between found valid paths
        const findLongestPath = (path, length) => {
            // Base-case: found the end
            //if(path.at(-1) === '22,21') {
            if(path.at(-1) === '140,139') {
                return [path, length];
            }

            // Continue search for complete paths
            const totalPaths = nodes[path.at(-1)].paths
                .map(connection => {
                    if(path.every(node => node !== connection.node))
                        return findLongestPath([...path, connection.node], length+connection.steps);
                })
                .filter(completePath => completePath !== undefined);
            
            // Determine the longest found path and return it only
            if(totalPaths.length > 0) {
                return totalPaths.reduce((longestPath, currenPath) => {
                    if(longestPath[1] < currenPath[1])
                        longestPath = currenPath;
                    return longestPath;
                }, [null, 0]);
            }
        };

        console.log(findLongestPath(['0,1'], 0));

    } catch (err) {
        console.log(err);
    }
}
example();