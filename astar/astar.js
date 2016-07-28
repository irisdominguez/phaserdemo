function astarPreProcess(graph) {
    let ci;
    for (ci in graph.connections)
    {
        let c = graph.connections[ci];
        let d = pointDistance(graph.nodes[c.p1], graph.nodes[c.p2]);
        graph.connections[ci].d = d;
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
        console.log("OpenList: ");
        console.log(openList);

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
            ret.push(currentNode.i);
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
            if (g.connections[v].p1 != currentNode.i &&
                g.connections[v].p2 != currentNode.i) continue;
            let ni = g.connections[v].p1;
            if (ni == currentNode.i) ni = g.connections[v].p2;

            let closedNode = false;
            for (let ci in closedList)
            {
                if (closedList[ci].i == ni) closedNode = true;
            }
            if (closedNode) continue;

            let neighbor = {};
            neighbor.i = ni;
            
            tmpg = currentNode.g + g.connections[v].d;
            let bestScore = false;
            let seen = false;
            
            for (let ci in openList)
            {
                if (openList[ci].i == neighbor.i)
                {
                    seen = true;
                    if (tmpg < openList[ci].g)
                    {
                        neighbor = openList[ci];
                        bestScore = true;
                    }
                }
            }
            if (!seen)
            {
                bestScore = true;
                neighbor.x = g.nodes[neighbor.i].x;
                neighbor.y = g.nodes[neighbor.i].y;
                neighbor.h = pointDistance[neighbor, finalNode];
                openList.push(neighbor);
            }

            if (bestScore)
            {
                neighbor.p = currentNode;
                neighbor.g = tmpg;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }
    return [];
}
