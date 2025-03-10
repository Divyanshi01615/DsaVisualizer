import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GitBranch, Code2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface Edge {
  from: number;
  to: number;
  weight?: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
}

type Algorithm = 'bfs' | 'dfs' | 'kruskal' | 'prim' | null;

const Graph = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(null);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [visitedEdges, setVisitedEdges] = useState<Edge[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Graph with weighted edges for MST algorithms
  const edges: Edge[] = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 2 },
    { from: 1, to: 4, weight: 5 },
    { from: 2, to: 5, weight: 1 },
    { from: 3, to: 6, weight: 6 },
    { from: 4, to: 6, weight: 4 },
  ];

  const nodes: Node[] = [
    { id: 0, x: 80, y: 80 },
    { id: 1, x: 200, y: 80 },
    { id: 2, x: 200, y: 200 },
    { id: 3, x: 320, y: 80 },
    { id: 4, x: 320, y: 200 },
    { id: 5, x: 440, y: 200 },
    { id: 6, x: 440, y: 80 },
  ];

  const drawGraph = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(node => node.id === edge.from);
      const toNode = nodes.find(node => node.id === edge.to);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Highlight visited edges for MST algorithms
        if (visitedEdges.some(e => 
          (e.from === edge.from && e.to === edge.to) || 
          (e.from === edge.to && e.to === edge.from)
        )) {
          ctx.strokeStyle = "green";
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();

        // Draw edge weight
        if (edge.weight !== undefined) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          ctx.fillStyle = "yellow";
          ctx.font = "14px Arial";
          ctx.fillText(edge.weight.toString(), midX, midY);
        }
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = visitedNodes.includes(node.id) ? 'green' : 'red';
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.stroke();
      
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(node.id.toString(), node.x - 6, node.y + 6);
    });
  };

  // BFS Implementation
  const bfs = async (startNode: number) => {
    const visited = new Set<number>();
    const queue = [startNode];
    visited.add(startNode);
    setVisitedNodes(Array.from(visited));
    drawGraph();

    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode === undefined) break;
      await sleep(1000);

      const neighbors = edges
        .filter(edge => edge.from === currentNode)
        .map(edge => edge.to);
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          setVisitedNodes(Array.from(visited));
          drawGraph();
        }
      }
    }
  };

  // DFS Implementation
  const dfs = async (startNode: number, visited: Set<number> = new Set()) => {
    visited.add(startNode);
    setVisitedNodes(Array.from(visited));
    drawGraph();
    await sleep(1000);

    const neighbors = edges
      .filter(edge => edge.from === startNode)
      .map(edge => edge.to);
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        await dfs(neighbor, visited);
      }
    }
  };

  // Kruskal's Algorithm Implementation
  const kruskal = async () => {
    const sortedEdges = [...edges].sort((a, b) => (a.weight || 0) - (b.weight || 0));
    const parent = new Array(nodes.length).fill(0).map((_, i) => i);
    const visitedMST: Edge[] = [];

    const find = (x: number): number => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (x: number, y: number) => {
      parent[find(x)] = find(y);
    };

    for (const edge of sortedEdges) {
      const rootFrom = find(edge.from);
      const rootTo = find(edge.to);

      if (rootFrom !== rootTo) {
        union(edge.from, edge.to);
        visitedMST.push(edge);
        setVisitedEdges([...visitedMST]);
        setVisitedNodes([...new Set([...visitedNodes, edge.from, edge.to])]);
        drawGraph();
        await sleep(1000);
      }
    }
  };

  // Prim's Algorithm Implementation
  const prim = async () => {
    const visited = new Set<number>();
    const visitedMST: Edge[] = [];
    visited.add(0);
    setVisitedNodes(Array.from(visited));

    while (visited.size < nodes.length) {
      let minEdge: Edge | null = null;
      let minWeight = Infinity;

      for (const edge of edges) {
        const weight = edge.weight || 0;
        if (
          ((visited.has(edge.from) && !visited.has(edge.to)) ||
           (visited.has(edge.to) && !visited.has(edge.from))) &&
          weight < minWeight
        ) {
          minWeight = weight;
          minEdge = edge;
        }
      }

      if (minEdge) {
        visited.add(visited.has(minEdge.from) ? minEdge.to : minEdge.from);
        visitedMST.push(minEdge);
        setVisitedEdges([...visitedMST]);
        setVisitedNodes(Array.from(visited));
        drawGraph();
        await sleep(1000);
      }
    }
  };

  const startAlgorithm = async () => {
    if (!selectedAlgorithm) return;
    setIsRunning(true);
    setVisitedNodes([]);
    setVisitedEdges([]);
    
    switch (selectedAlgorithm) {
      case 'bfs':
        await bfs(0);
        break;
      case 'dfs':
        await dfs(0);
        break;
      case 'kruskal':
        await kruskal();
        break;
      case 'prim':
        await prim();
        break;
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    drawGraph();
  }, [visitedNodes, visitedEdges]);

  return (
    <div className="max-w-4xl mx-auto text-white">
      <div className="mb-6 bg-gray-900 p-4 rounded">
        <h2 className="text-3xl font-bold">Graph and Algorithm Implementation</h2>
        <p className="mt-4">A graph is a non-linear data structure consisting of nodes (vertices) and edges that connect these nodes.</p>
      </div>
      
      <div className="flex justify-center mb-8">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          className="border border-gray-400 bg-gray-900 rounded-lg"
        />
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => setSelectedAlgorithm('bfs')} 
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'bfs' ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          BFS
        </button>
        <button 
          onClick={() => setSelectedAlgorithm('dfs')} 
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'dfs' ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          DFS
        </button>
        <button 
          onClick={() => setSelectedAlgorithm('kruskal')} 
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'kruskal' ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          Kruskal's MST
        </button>
        <button 
          onClick={() => setSelectedAlgorithm('prim')} 
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'prim' ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          Prim's MST
        </button>
        <button 
          onClick={startAlgorithm} 
          disabled={isRunning || !selectedAlgorithm} 
          className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Algorithm
        </button>
      </div>

      {selectedAlgorithm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-gray-800 p-6 rounded"
        >
          <h3 className="text-xl font-bold mb-4">{selectedAlgorithm.toUpperCase()} Algorithm</h3>
          
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Time Complexity:</h4>
            <p>{
              selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs' 
                ? 'O(V + E) where V is the number of vertices and E is the number of edges'
                : 'O(E log E) where E is the number of edges'
            }</p>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Space Complexity:</h4>
            <p>{
              selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs'
                ? 'O(V) where V is the number of vertices'
                : 'O(V) where V is the number of vertices'
            }</p>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Python Implementation:</h4>
            <pre className="bg-gray-700 p-4 rounded-lg overflow-x-auto">
              {selectedAlgorithm === 'bfs' ? `
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        print(vertex, end=' ')  # Process vertex
        
        # Add unvisited neighbors to queue
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)` 
              : selectedAlgorithm === 'dfs' ? `
def dfs(graph, vertex, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(vertex)
    print(vertex, end=' ')  # Process vertex
    
    # Recursively visit unvisited neighbors
    for neighbor in graph[vertex]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)`
              : selectedAlgorithm === 'kruskal' ? `
class UnionFind:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}
    
    def find(self, item):
        if self.parent[item] != item:
            self.parent[item] = self.find(self.parent[item])
        return self.parent[item]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1

def kruskal(graph):
    # Sort edges by weight
    edges = [(w, u, v) for u in graph for v, w in graph[u].items()]
    edges.sort()
    
    vertices = list(graph.keys())
    uf = UnionFind(vertices)
    mst = []
    
    for weight, u, v in edges:
        if uf.find(u) != uf.find(v):
            uf.union(u, v)
            mst.append((u, v, weight))
    
    return mst`
              : `
from heapq import heappush, heappop

def prim(graph):
    # Start with first vertex
    start_vertex = list(graph.keys())[0]
    visited = {start_vertex}
    edges = []
    # Add all edges from start vertex
    heap = [(w, start_vertex, v) 
            for v, w in graph[start_vertex].items()]
    heapq.heapify(heap)
    
    while heap and len(visited) < len(graph):
        weight, u, v = heapq.heappop(heap)
        if v in visited:
            continue
            
        visited.add(v)
        edges.append((u, v, weight))
        
        # Add new edges to heap
        for next_vertex, w in graph[v].items():
            if next_vertex not in visited:
                heapq.heappush(heap, (w, v, next_vertex))
    
    return edges`}
            </pre>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 mt-8">
        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GitBranch className="text-blue-400" /> Graph Properties
          </h3>
          <ul className="space-y-2">
            <li>• <strong>Vertices:</strong> Points or nodes in the graph</li>
            <li>• <strong>Edges:</strong> Connections between vertices</li>
            <li>• <strong>Direction:</strong> Can be directed or undirected</li>
            <li>• <strong>Weight:</strong> Edges can have weights/costs</li>
            <li>• <strong>Path:</strong> Sequence of vertices connected by edges</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="text-green-400" /> Graph Types
          </h3>
          <ul className="space-y-2">
            <li>• <strong>Undirected Graph:</strong> Edges have no direction</li>
            <li>• <strong>Directed Graph:</strong> Edges have direction</li>
            <li>• <strong>Weighted Graph:</strong> Edges have weights</li>
            <li>• <strong>Connected Graph:</strong> Path exists between any two vertices</li>
            <li>• <strong>Complete Graph:</strong> Edge between every pair of vertices</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-yellow-400" /> Applications
          </h3>
          <ul className="space-y-2">
            <li>• Social Networks</li>
            <li>• GPS and Navigation</li>
            <li>• Network Routing</li>
            <li>• Dependency Resolution</li>
            <li>• Game Development</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-400" /> Advantages
          </h3>
          <ul className="space-y-2">
            <li>• Efficient representation of relationships</li>
            <li>• Flexible structure for various problems</li>
            <li>• Natural modeling of real-world scenarios</li>
            <li>• Support for different traversal methods</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <XCircle className="text-red-400" /> Disadvantages
          </h3>
          <ul className="space-y-2">
            <li>• High memory usage for dense graphs</li>
            <li>• Complex implementation for some algorithms</li>
            <li>• Potential for performance bottlenecks</li>
            <li>• Difficulty in handling dynamic changes</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-400" /> Common Operations
          </h3>
          <ul className="space-y-2">
            <li>• <strong>Traversal:</strong> BFS, DFS</li>
            <li>• <strong>Shortest Path:</strong> Dijkstra's, Bellman-Ford</li>
            <li>• <strong>Minimum Spanning Tree:</strong> Kruskal's, Prim's</li>
            <li>• <strong>Cycle Detection:</strong> Union Find, DFS</li>
            <li>• <strong>Topological Sort:</strong> For directed acyclic graphs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Graph;