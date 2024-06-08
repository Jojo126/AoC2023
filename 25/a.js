const fs = require('node:fs/promises');

async function example() {
    try {
        const input = (await fs.readFile('./example_input.txt', { encoding: 'utf8' }))
            .split('\r\n')
            .map(row => {
                const [key, val] = row.split(':');
                return [key, val.trim().split(' ')]
            });

        // Know there has to be a solution where the two groups will have at most 3 crossing connections to cut
        // Will use Fiduccia-Mattheyses algorithm over and over until that solution is found

        // Find the total number of crossing edges between the two groups for the current split graph state
        const getGraphTotalCrossingEdges = (graph) => {
            console.log('Finding total crossing edges in current graph state. This might take some time...');
            let totalCrossings = 0;
            const graphLength = Object.keys(graph).length;
            for(let i = 0; i < graphLength; i++) {
                const a = Object.values(graph)[i];
                for(let j = i+1; j < graphLength; j++) {
                    const b = Object.keys(graph)[j];
                    if(a.edges.indexOf(b) !== -1 && a.side !== graph[b].side) {
                        totalCrossings += 1;
                    }
                }
            }
            console.log('Finished!');
            return totalCrossings;
        };

        // Find the gain of every node in the graph and place them in their correct buckets with the correct gain
        const assignNodesToBuckets = (graph, leftBucket, rightBucket) => {
            Object.keys(graph).forEach(node => {
                const total = graph[node].edges.length;
                const crossing = graph[node].edges.reduce((acc, connectedNode) => {
                    if(graph[node].side !== graph[connectedNode].side)
                        acc += 1;
                    return acc;
                }, 0);
    
                if(graph[node].side === 'left') {
                    leftBucket[2*crossing - total + maxEdgesOnNode].nodes.push(node);
                } else {
                    rightBucket[2*crossing - total + maxEdgesOnNode].nodes.push(node);
                }
            });
        };

        // Finds the node that will decrease the total of crossing edges the most and is in the bucket with most nodes in
        // It also removes the node from the bucket
        const findNodeToMove = (leftBucket, rightBucket, maxEdgesOnNode) => {
            // Node should be fetched from bucket with most nodes in
            const leftBucketNodesTotal = leftBucket.reduce((total, gain) => total += gain.nodes.length, 0);
            const rightBucketNodesTotal = rightBucket.reduce((total, gain) => total += gain.nodes.length, 0);
            // From highest gain to lowest
            for(i = maxEdgesOnNode*2; i >= 0; i--) {
                if(leftBucketNodesTotal > rightBucketNodesTotal) {
                    if(leftBucket[i].nodes.length > 0) {
                        const movedNode = leftBucket[i].nodes.shift();
                        return [movedNode, leftBucket[i].gain];
                    }
                }
                else if(leftBucketNodesTotal < rightBucketNodesTotal) {
                    if(rightBucket[i].nodes.length > 0) {
                        const movedNode = rightBucket[i].nodes.shift();
                        return [movedNode, rightBucket[i].gain];
                    }
                }
                else {
                    if(leftBucket[i].nodes.length > 0) {
                        const movedNode = leftBucket[i].nodes.shift();
                        return [movedNode, leftBucket[i].gain];
                    }
                    else if(rightBucket[i].nodes.length > 0) {
                        const movedNode = rightBucket[i].nodes.shift();
                        return [movedNode, rightBucket[i].gain];
                    }
                }
            }
        };

        // Get all nodes and store them as a double-linked list
        let graph = {};
        input.forEach(mapping => {
            // If node is new
            if(!graph[mapping[0]])
                graph[mapping[0]] = {edges: mapping[1]};
            // If seen node before
            // - Add connection to previous entry and filter any duplicates
            else if(!graph[mapping[0]]?.edges?.includes(mapping[1]))
                graph[mapping[0]] = {edges: [...graph[mapping[0]].edges, ...mapping[1]]}

            mapping[1].forEach(b => {
                if(!graph[b])
                    graph[b] = {edges: [mapping[0]]};
                else if(!graph[b]?.edges?.includes(mapping[0]))
                    graph[b] = {edges: [...graph[b].edges, mapping[0]]}
            });
        });

        // Find the most amount of edges for a node
        const maxEdgesOnNode = Object.values(graph).reduce((max, node) => max < node.edges.length ? node.edges.length : max, 0);

        // Create the two node groups/buckets with a bucket for each amount of possible gain
        const leftBucket = Array(maxEdgesOnNode*2+1);
        const rightBucket = Array(maxEdgesOnNode*2+1);
        for(let i = 0; i < maxEdgesOnNode*2+1; i++) {
            leftBucket[i] = {
                gain: i - maxEdgesOnNode,
                nodes: []
            };
            rightBucket[i] = {
                gain: i - maxEdgesOnNode,
                nodes: []
            };
        }

        // Split the graph into two equal-sized groups
        Object.keys(graph)
            .slice(0, Math.round(Object.keys(graph).length/2))
            .forEach(node => {
                graph[node].side = 'left';
            });
        Object.keys(graph)
            .slice(Math.round(Object.keys(graph).length/2))
            .forEach(node => {
                graph[node].side = 'right';
            });
        
        assignNodesToBuckets(graph, leftBucket, rightBucket);

        let totalCrossings = getGraphTotalCrossingEdges(graph);

        let lockedNodes = [];

        let bestResult = {
            name: null,
            crossings: maxEdgesOnNode,
            graphSnapShot: null
        };

        // Fiduccia-Mattheyses algorithm:
        // - Find node with highest gain from bucket with most nodes in
        // - Move the node to the other bucket and update all connected nodes gain
        // - Lock the moved node together with the new total amount of crossing edges
        const fmPass = () => {
            // Find best node to move
            const [lockedNode, gain] = findNodeToMove(leftBucket, rightBucket, maxEdgesOnNode);
            graph[lockedNode].side = graph[lockedNode].side === 'left' ? 'right' : 'left';
            
            // Update connected nodes gain
            graph[lockedNode].edges.forEach(node => {
                const total = graph[node].edges.length;
                const crossing = graph[node].edges.reduce((acc, connectedNode) => {
                    if(graph[node].side !== graph[connectedNode].side)
                        acc += 1;
                    return acc;
                }, 0);

                if(graph[node].side === 'left' && leftBucket[2*crossing - total + maxEdgesOnNode].nodes.every(a => a !== node)) {
                    // Remove from previous gain
                    leftBucket.forEach((gain, i) => {
                        const index = gain.nodes.indexOf(node);
                        if(index !== -1) {
                            leftBucket[i].nodes.splice(index, 1);
                        }
                    });
                    // Add to new gain
                    leftBucket[2*crossing - total + maxEdgesOnNode].nodes.push(node);
                } else if(graph[node].side === 'right' && rightBucket[2*crossing - total + maxEdgesOnNode].nodes.every(a => a !== node)) {
                    // Remove from previous gain
                    rightBucket.forEach((gain, i) => {
                        const index = gain.nodes.indexOf(node);
                        if(index !== -1) {
                            rightBucket[i].nodes.splice(index, 1);
                        }
                    });
                    // Add to new gain
                    rightBucket[2*crossing - total + maxEdgesOnNode].nodes.push(node);
                }
            });
            
            // Update total crossing edges in current graph state
            totalCrossings -= gain;

            // Lock the moved node
            lockedNodes.push({name: lockedNode, crossings: totalCrossings});

            // Store as best found state yet to roll back to later
            if(totalCrossings <= bestResult.crossings) {
                bestResult = {
                    name: lockedNode,
                    crossings: totalCrossings,
                    graphSnapShot: structuredClone(graph),
                    bucketsSnaphots: {
                        left: structuredClone(leftBucket),
                        right: structuredClone(rightBucket)
                    }
                };
            }
        };

        // Unlock all nodes and redo FM-pass until the solution is found
        while(bestResult.crossings > 3) {
            // Roll back graph to earlier state with best total crossing edges
            if(bestResult?.graphSnapShot)
                graph = bestResult.graphSnapShot;
            //console.log(graph);

            // Reset buckets
            leftBucket.map(gainBucket => {
                gainBucket.nodes = []; 
                return gainBucket;
            });
            rightBucket.map(gainBucket => {
                gainBucket.nodes = []; 
                return gainBucket;
            });

            // Assign every node to the correct bucket with the correct gain
            assignNodesToBuckets(graph, leftBucket, rightBucket);

            // Update the current total of crossing edges
            totalCrossings = getGraphTotalCrossingEdges(graph);
            
            // Unlock all nodes
            lockedNodes = [];

            // Run the algorithm again until solution is found or all nodes are locked again
            do {
                fmPass();            
            } while (lockedNodes.at(-1)?.crossings > 3 && lockedNodes.length < Object.keys(graph).length);
        }
        
        // Reset buckets
        leftBucket.map(gainBucket => {
            gainBucket.nodes = []; 
            return gainBucket;
        });
        rightBucket.map(gainBucket => {
            gainBucket.nodes = []; 
            return gainBucket;
        });

        // Check number of crossing edges for final graph (should be 3 or less)
        assignNodesToBuckets(graph, leftBucket, rightBucket);
        
        let leftBucketTotal = leftBucket.reduce((total, gain) => total += gain.nodes.length, 0);
        let rightBucketTotal = rightBucket.reduce((total, gain) => total += gain.nodes.length, 0);
        console.log(leftBucketTotal * rightBucketTotal);
            

    } catch (err) {
        console.log(err);
    }
}
example();