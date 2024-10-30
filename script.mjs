import { Tree } from "./Tree.mjs";
import { Node } from "./Node.mjs";

function buildGraph(startPos, adjacenyList) {
    if (adjacenyList.keys !== undefined && Object.keys(adjacenyList).length === 64)
        return;

    const destinations = [];

    const x = startPos[0];
    const y = startPos[1];
    
    destinations.push([x + 2, y + 1]);
    destinations.push([x + 1, y + 2]);
    destinations.push([x + -2, y + 1]);
    destinations.push([x + 1, y + -2]);
    destinations.push([x + -2, y + -1]);
    destinations.push([x + -1, y + -2]);
    destinations.push([x + 2, y + -1]);
    destinations.push([x + -1, y + 2]);

    const filteredDestinations = destinations.filter(item => item[0] >= 0 && item[0] <= 7 && item[1] >= 0 && item[1] <= 7);

    adjacenyList[startPos] = filteredDestinations;

    for(let item of filteredDestinations) {
        if (item in adjacenyList)
            continue;
        buildGraph(item, adjacenyList);
    }
}

function buildTree(graph, startPos) {
    const spanningTree = new Tree(startPos);

    const rootNode = spanningTree.root;

    const visited = [startPos.toString()];
    const queue = [rootNode];
    
    (function travse() {
        const currentNode = queue.shift();
        for (let item of graph[currentNode.value]) {
            if (visited.includes(item.toString()))
                continue;
            const newNode = new Node(item);
            currentNode.children.push(newNode);
            visited.push(item.toString());
            queue.push(newNode);
        }

        if (queue.length !== 0)
            travse(currentNode);

    })(rootNode)

    return spanningTree;
}

function dfs(root, endPos, path=[root.value]) {
    if (root.children.length === 0 && root.value.toString() !== endPos.toString())
        return false;

    if (root.value.toString() === endPos.toString())
        return path;

    for (let node of root.children) {
        path.push(node.value);
        const result = dfs(node, endPos, path);
        if (!result) {
            path.pop();
            continue;
        }
        return path;
    }
}

function knightMoves(startPos, endPos) {
    if (!(startPos[0] >= 0 && startPos[0] <= 7 && startPos[1] >= 0 && startPos[1] <= 7 && endPos[0] >= 0 && endPos[0] <= 7 && endPos[1] >= 0 && endPos[1] <= 7)) 
        return "invalid input";

    const graph = {};

    buildGraph(startPos, graph);  

    const root = buildTree(graph, startPos).root;

    let path = [root.value];
    
    return dfs(root, endPos, path);
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        console.log(`shortest path from [${i}, ${j}] to [${j}, ${i}]:`)
        console.log(knightMoves([i, j], [j, i]), "\n");
    }
}