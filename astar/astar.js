function astarPreProcess(graph) {
    let ci;
    for (ci in graph.connections)
    {
        let c = graph.connections[ci];
        let d = pointDistance(graph.nodes[c.p1], graph.nodes[c.p2]);
    }
}

function pointDistance(p1, p2) {
    let v = [p2.x - p1.x, p2.y - p1.y];
    let d = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    return d;
}

function findPath(g, i, j) {
    let initialNode = g.nodes[i];
    let finalNode = g.nodes[j];
    finalNode.i = j;
    let openList = [initialNode];
    let closedList = [];
    initialNode.i = i;
    initialNode.g = 0;
    initialNode.h = pointDistance(initialNode, finalNode);
    initialNode.f = initialNode.g +initialNode.h;
    initialNode.p = null;
    while (openList.length > 0)
    {
        let currentNode = openList[0];
        let tmpIndex = 0;
        for (let i in openList)
        {
            if (openList[i].f < currentNode.f) 
            {
                currentNode = openList[i];
                tmpIndex = i;
            }
        }
        openList.splice(tmpIndex, 1);

        if (currentNode.i == finalNode.i) 
        {
            let ret = [];
            while (currentNode.p != null)
            {
                ret.push(currentNode.p.i);
                currentNode = currentNode.p;
            }
            return ret.reverse();
        }

        closedList.push(currentNode);
        for (let v in g.connections)
        {
            if (g.connections[v].p1 != currentNode.i) continue;
        }
    }
}
