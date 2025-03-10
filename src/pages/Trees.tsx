import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TreeNode {
  value: number;
  x: number;
  y: number;
  height?: number;
  left?: TreeNode;
  right?: TreeNode;
}

const Trees = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [traversalType, setTraversalType] = useState<string>('inorder');
  const [operationType, setOperationType] = useState<string>('traversal');
  const [lcaNodes, setLcaNodes] = useState<{ node1: number; node2: number }>({ node1: 0, node2: 0 });
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);

  useEffect(() => {
    // Initialize example BST
    const initialTree: TreeNode = {
      value: 50,
      x: 400,
      y: 50,
      height: 3,
      left: {
        value: 30,
        x: 200,
        y: 100,
        height: 2,
        left: {
          value: 20,
          x: 100,
          y: 150,
          height: 1,
        },
        right: {
          value: 40,
          x: 300,
          y: 150,
          height: 1,
        },
      },
      right: {
        value: 70,
        x: 600,
        y: 100,
        height: 2,
        left: {
          value: 60,
          x: 500,
          y: 150,
          height: 1,
        },
        right: {
          value: 80,
          x: 700,
          y: 150,
          height: 1,
        },
      },
    };
    setRoot(initialTree);
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // BST Operations
  const insertNode = async (value: number) => {
    const insert = async (node: TreeNode | null, val: number, depth: number = 0): Promise<TreeNode> => {
      if (!node) {
        return {
          value: val,
          x: 400,
          y: depth * 50 + 50,
          height: 1,
        };
      }

      setCurrentNode(node.value);
      await sleep(animationSpeed);

      if (val < node.value) {
        node.left = await insert(node.left, val, depth + 1);
        node.left.x = node.x - (200 / (depth + 1));
      } else {
        node.right = await insert(node.right, val, depth + 1);
        node.right.x = node.x + (200 / (depth + 1));
      }

      node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
      return balanceNode(node);
    };

    const newRoot = await insert(root, value);
    setRoot(newRoot);
    setCurrentNode(null);
  };

  const deleteNode = async (value: number) => {
    const remove = async (node: TreeNode | null, val: number): Promise<TreeNode | null> => {
      if (!node) return null;

      setCurrentNode(node.value);
      await sleep(animationSpeed);

      if (val < node.value) {
        node.left = await remove(node.left, val);
      } else if (val > node.value) {
        node.right = await remove(node.right, val);
      } else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let minNode = node.right;
        while (minNode.left) {
          minNode = minNode.left;
        }
        node.value = minNode.value;
        node.right = await remove(node.right, minNode.value);
      }

      node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
      return balanceNode(node);
    };

    const newRoot = await remove(root, value);
    setRoot(newRoot);
    setCurrentNode(null);
  };

  // AVL Tree Operations
  const getHeight = (node: TreeNode | null): number => {
    return node?.height || 0;
  };

  const getBalance = (node: TreeNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const rotateRight = async (y: TreeNode): Promise<TreeNode> => {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

    // Update x and y coordinates for visualization
    const oldX = y.x;
    const oldY = y.y;
    y.x = x.x;
    y.y = x.y + 50;
    x.x = oldX;
    x.y = oldY;

    await sleep(animationSpeed);
    return x;
  };

  const rotateLeft = async (x: TreeNode): Promise<TreeNode> => {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

    // Update x and y coordinates for visualization
    const oldX = x.x;
    const oldY = x.y;
    x.x = y.x;
    x.y = y.y + 50;
    y.x = oldX;
    y.y = oldY;

    await sleep(animationSpeed);
    return y;
  };

  const balanceNode = async (node: TreeNode): Promise<TreeNode> => {
    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && getBalance(node.left) >= 0) {
      return rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && getBalance(node.right) <= 0) {
      return rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && getBalance(node.left) < 0) {
      node.left = await rotateLeft(node.left!);
      return rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && getBalance(node.right) > 0) {
      node.right = await rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  };

  // LCA Implementation
  const findLCA = async (node1: number, node2: number) => {
    const lca = async (node: TreeNode | null, n1: number, n2: number): Promise<TreeNode | null> => {
      if (!node) return null;

      setCurrentNode(node.value);
      await sleep(animationSpeed);

      if (node.value > n1 && node.value > n2) {
        return lca(node.left, n1, n2);
      }
      if (node.value < n1 && node.value < n2) {
        return lca(node.right, n1, n2);
      }

      return node;
    };

    const result = await lca(root, node1, node2);
    setCurrentNode(result?.value || null);
    return result;
  };

  // Traversal Functions (unchanged)
  const inorderTraversal = async (node: TreeNode | null, result: number[] = []) => {
    if (!node) return result;

    await inorderTraversal(node.left, result);
    setCurrentNode(node.value);
    await sleep(animationSpeed);
    result.push(node.value);
    setTraversalResult([...result]);
    await inorderTraversal(node.right, result);
    return result;
  };

  const preorderTraversal = async (node: TreeNode | null, result: number[] = []) => {
    if (!node) return result;

    setCurrentNode(node.value);
    await sleep(animationSpeed);
    result.push(node.value);
    setTraversalResult([...result]);
    await preorderTraversal(node.left, result);
    await preorderTraversal(node.right, result);
    return result;
  };

  const postorderTraversal = async (node: TreeNode | null, result: number[] = []) => {
    if (!node) return result;

    await postorderTraversal(node.left, result);
    await postorderTraversal(node.right, result);
    setCurrentNode(node.value);
    await sleep(animationSpeed);
    result.push(node.value);
    setTraversalResult([...result]);
    return result;
  };

  const startOperation = async (type: string) => {
    setTraversalResult([]);
    setCurrentNode(null);
    setOperationType(type);

    switch (type) {
      case 'inorder':
      case 'preorder':
      case 'postorder':
        setTraversalType(type);
        if (type === 'inorder') await inorderTraversal(root);
        else if (type === 'preorder') await preorderTraversal(root);
        else await postorderTraversal(root);
        break;
      case 'insert':
        if (newValue) await insertNode(parseInt(newValue));
        break;
      case 'delete':
        if (newValue) await deleteNode(parseInt(newValue));
        break;
      case 'lca':
        await findLCA(lcaNodes.node1, lcaNodes.node2);
        break;
    }

    setCurrentNode(null);
  };

  const drawTree = (ctx: CanvasRenderingContext2D, node: TreeNode) => {
    // Draw connections
    if (node.left) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(node.left.x, node.left.y);
      ctx.strokeStyle = '#4B5563';
      ctx.stroke();
      drawTree(ctx, node.left);
    }

    if (node.right) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(node.right.x, node.right.y);
      ctx.strokeStyle = '#4B5563';
      ctx.stroke();
      drawTree(ctx, node.right);
    }

    // Draw node with animation for current traversal
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = currentNode === node.value ? '#FBBF24' : '#3B82F6';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value.toString(), node.x, node.y);

    // Draw height value
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px Arial';
    ctx.fillText(`h=${node.height}`, node.x, node.y + 30);
  };

  const getOperationCode = (type: string) => {
    switch (type) {
      case 'insert':
        return `const insert = (root, value) => {
  if (!root) return new Node(value);
  
  if (value < root.value)
    root.left = insert(root.left, value);
  else
    root.right = insert(root.right, value);
    
  root.height = Math.max(height(root.left), height(root.right)) + 1;
  return balance(root);
};`;
      case 'delete':
        return `const remove = (root, value) => {
  if (!root) return null;
  
  if (value < root.value)
    root.left = remove(root.left, value);
  else if (value > root.value)
    root.right = remove(root.right, value);
  else {
    if (!root.left || !root.right)
      return root.left || root.right;
      
    const temp = minNode(root.right);
    root.value = temp.value;
    root.right = remove(root.right, temp.value);
  }
  
  root.height = Math.max(height(root.left), height(root.right)) + 1;
  return balance(root);
};`;
      case 'lca':
        return `const findLCA = (root, n1, n2) => {
  if (!root) return null;
  
  if (root.value > n1 && root.value > n2)
    return findLCA(root.left, n1, n2);
    
  if (root.value < n1 && root.value < n2)
    return findLCA(root.right, n1, n2);
    
  return root;
};`;
      default:
        return getTraversalCode(type);
    }
  };

  const getTraversalCode = (type: string) => {
    switch (type) {
      case 'inorder':
        return `const inorderTraversal = (node) => {
  if (!node) return;
  inorderTraversal(node.left);
  console.log(node.value);
  inorderTraversal(node.right);
};`;
      case 'preorder':
        return `const preorderTraversal = (node) => {
  if (!node) return;
  console.log(node.value);
  preorderTraversal(node.left);
  preorderTraversal(node.right);
};`;
      case 'postorder':
        return `const postorderTraversal = (node) => {
  if (!node) return;
  postorderTraversal(node.left);
  postorderTraversal(node.right);
  console.log(node.value);
};`;
      default:
        return '';
    }
  };

  const getTimeComplexityGraph = () => {
    const pieData = {
      inorder: [25, 25, 25, 25],
      preorder: [20, 30, 30, 20],
      postorder: [30, 20, 25, 25],
      insert: [20, 40, 20, 20],
      delete: [20, 20, 40, 20],
      lca: [40, 20, 20, 20]
    };

    return (
      <>
        <h3 className="text-lg font-semibold text-white mb-4">Time Complexity</h3>
        
        <table className="min-w-full table-auto text-white mb-6 border-2 border-gray-600">
          <thead>
            <tr className="border-b-2 border-gray-600">
              <th className="px-4 py-2 text-left border-r-2 border-gray-600">Operation</th>
              <th className="px-4 py-2 text-left border-r-2 border-gray-600">Best Case</th>
              <th className="px-4 py-2 text-left border-r-2 border-gray-600">Average Case</th>
              <th className="px-4 py-2 text-left">Worst Case</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b-2 border-gray-600">
              <td className="px-4 py-2 border-r-2 border-gray-600">Traversal</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(n)</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(n)</td>
              <td className="px-4 py-2">O(n)</td>
            </tr>
            <tr className="border-b-2 border-gray-600">
              <td className="px-4 py-2 border-r-2 border-gray-600">Search</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2">O(n)</td>
            </tr>
            <tr className="border-b-2 border-gray-600">
              <td className="px-4 py-2 border-r-2 border-gray-600">Insert</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2">O(n)</td>
            </tr>
            <tr className="border-b-2 border-gray-600">
              <td className="px-4 py-2 border-r-2 border-gray-600">Delete</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2">O(n)</td>
            </tr>
            <tr className="border-b-2 border-gray-600">
              <td className="px-4 py-2 border-r-2 border-gray-600">LCA</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2 border-r-2 border-gray-600">O(log n)</td>
              <td className="px-4 py-2">O(n)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold text-white mb-4">Operation Complexity Distribution</h3>
        <div style={{ width: '203px', height: '203px', margin: '0 auto' }}>
          <Pie
            data={{
              labels: ['Traversal O(n)', 'Search O(log n)', 'Insert O(log n)', 'Delete O(log n)'],
              datasets: [
                {
                  data: pieData[operationType] || pieData.inorder,
                  backgroundColor: ['#34D399', '#F87171', '#FBBF24', '#3B82F6'],
                  hoverBackgroundColor: ['#34D399', '#F87171', '#FBBF24', '#3B82F6'],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
                  },
                },
              },
              maintainAspectRatio: false,
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Tree Data Structures</h1>
      
      <div className="space-y-6">
        {/* Tree Definition Card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md duration-300">
          <p className="text-white text mb-4">
            A tree is a non-linear type of data structure that organizes data hierarchically. It consists of nodes connected by edges. Each node contains a value and may or may not have a child node.
          </p>
        </div>
        {/* Terminologies Card */}
  <div className="bg-gray-800 p-6 rounded-lg shadow-md duration-300">
    <h3 className="text-xl font-semibold text-white mb-4">Terminologies</h3>
    <ul className="text-white text mb-4">
      <li><strong>• Node:</strong> Node is the main component of a tree that stores the data along with the links to other nodes.</li>
      <li><strong>• Edge:</strong> Edge (also called a branch) connects two nodes of a tree. A node can have more than one edge.</li>
      <li><strong>• Parent:</strong> Parent node is a predecessor to any other node. In simple words, it is a node in the tree that has branches to other nodes.</li>
      <li><strong>• Child:</strong> The node which is connected below to another node is called a child of that node. All nodes except the root node are child nodes.</li>
      <li><strong>• Root:</strong> The first node of the tree which originates it is called the root of the tree. A tree can have only one root.</li>
      <li><strong>• Leaf Node:</strong> Nodes with no child are called leaf nodes or external nodes.</li>
      <li><strong>• Internal Node:</strong> Nodes with at least one child are called internal nodes or non-leaf nodes.</li>
      <li><strong>• Siblings:</strong> Nodes having the same parent are called siblings.</li>
      <li><strong>• Cousins:</strong> Nodes belonging to the same level with different parent nodes.</li>
      <li><strong>• Degree:</strong> Degree of a node is defined as the number of children of that node. The degree of the tree is the highest degree of a node among all the nodes.</li>
      <li><strong>• Path:</strong> The nodes in the tree have to be reachable from other nodes through a unique sequence of edges called a path. The number of edges in a path is called the length of the path.</li>
      <li><strong>• Level of a Node:</strong> The level of a node is defined as the number of edges in the unique path between the root and the node.</li>
      <li><strong>• Subtree:</strong> A tree formed by a node and all of its descendants in the tree is called a subtree.</li>
    </ul>
  </div><br />
  {/* Types of Trees Card */}
  <div className="bg-gray-800 p-6 rounded-lg shadow-md duration-300">
    <h3 className="text-xl font-semibold text-white mb-4">Types of Trees</h3>
    <ul className="text-white text mb-4">
      <li><strong>• Binary Tree:</strong> A binary tree is a tree data structure where each node has at most two children.</li>
      <li><strong>• Binary Search Tree:</strong> A binary search tree (BST) is a binary tree in which the left child’s value is less than its parent, and the right child’s value is greater than its parent.</li>
      <li><strong>• AVL Tree:</strong> An AVL tree is a self-balancing binary search tree where the difference between the heights of left and right subtrees cannot be greater than one.</li>
      <li><strong>• Heap:</strong> A heap is a special tree-based data structure in which the tree is a complete binary tree, and the value of each node is ordered with respect to its children.</li>
    </ul>
  </div><br />
  {/* Properties of Trees Card */}
  <div className="bg-gray-800 p-6 rounded-lg shadow-md duration-300">
    <h3 className="text-xl font-semibold text-white mb-4">Properties of Trees</h3>
    <ul className="text-white text mb-4">
      <li><strong>• Number of Edges:</strong> If a tree has N nodes, it will have (N-1) edges.</li>
      <li><strong>• Depth of a Node:</strong> The depth of a node is the number of edges in the path from the root to the node.</li>
      <li><strong>• Height of a Node:</strong> The height of a node is the length of the longest path from the node to a leaf node of the tree.</li>
      <li><strong>• Height of a Tree:</strong> The height of a tree is the length of the longest path from the root to a leaf node.</li>
      <li><strong>• Degree of a Node:</strong> The degree of a node is the number of subtrees attached to that node.</li>
    </ul>
  </div><br />
  {/* Tree Traversal Card */}
  <div className="bg-gray-800 p-6 rounded-lg shadow-md duration-300">
    <h3 className="text-xl font-semibold text-white mb-4">Tree Traversal</h3>
    <p className="text-white text-lg mb-4">
      Traversing in a tree is done by depth-first search (DFS) and breadth-first search (BFS) algorithms.
    </p>
  </div><br />
  {/* Applications of Trees Card */}
  <div className="bg-gray-800 p-6 rounded-lg shadow-md  duration-300">
    <h3 className="text-xl font-semibold text-white mb-4">Applications of Trees</h3>
    <ul className="text-white text mb-4">
      <li><strong>• Hierarchical Data:</strong> Trees can be used to store data in hierarchical form.</li>
      <li><strong>• File System Management:</strong> Tree structures are used by operating systems to manage file directories.</li>
      <li><strong>• Database Indexing:</strong> Databases use tree data structures for indexing.</li>
      <li><strong>• DNS:</strong> The Domain Name System uses a tree structure.</li>
      <li><strong>• Games:</strong> Trees are used in several games, such as modeling moves in chess.</li>
      <li><strong>• Decision Trees:</strong> Trees are used in decision-based algorithms in machine learning.</li>
    </ul>
  </div><br />
  {/* Advantages and Disadvantages Card */}
  <div className="bg-gray-800 p-6 rounded-lg shadow-md duration-300">
    <h3 className="text-xl font-semibold text-white mb-4">Advantages & Disadvantages of Trees</h3>
    <ul className="text-white text mb-4">
      <li><strong>Advantages:</strong>
        <ul>
          <li>• Trees provide a hierarchical representation for data.</li>
          <li>• Trees are dynamic in nature, so the number of nodes is not limited.</li>
          <li>• Insertion and deletion in a tree can be done in moderate time.</li>
        </ul>
      </li><br />
      <li><strong>Disadvantages:</strong>
        <ul>
          <li>• Some trees can only be stored using sequential or chained storage.</li>
          <li>• Complex operations in certain types of trees may lead to high overhead.</li>
        </ul>
      </li>
    </ul>
  </div>
        
        {/* Operations Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tree Operations</h2>

          {/* Operation Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter value"
                className="px-3 py-2 bg-gray-700 text-white rounded"
              />
              <button
                onClick={() => startOperation('insert')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Insert
              </button>
              <button
                onClick={() => startOperation('delete')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={lcaNodes.node1}
                onChange={(e) => setLcaNodes({ ...lcaNodes, node1: parseInt(e.target.value) })}
                placeholder="Node 1"
                className="px-3 py-2 bg-gray-700 text-white rounded w-24"
              />
              <input
                type="number"
                value={lcaNodes.node2}
                onChange={(e) => setLcaNodes({ ...lcaNodes, node2: parseInt(e.target.value) })}
                placeholder="Node 2"
                className="px-3 py-2 bg-gray-700 text-white rounded w-24"
              />
              <button
                onClick={() => startOperation('lca')}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Find LCA
              </button>
            </div>
          </div>

          {/* Traversal Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => startOperation('inorder')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Inorder
            </button>
            <button
              onClick={() => startOperation('preorder')}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Preorder
            </button>
            <button
              onClick={() => startOperation('postorder')}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Postorder
            </button>
          </div>

          {/* Animation Speed Control */}
          <div className="mb-8">
            <label className="text-white block mb-2">Animation Speed (ms)</label>
            <input
              type="range"
              min="100"
              max="2000"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Tree Visualization */}
          <canvas
            width={800}
            height={400}
            className="bg-gray-900 rounded-lg mx-auto mb-6"
            ref={(canvas) => {
              if (canvas && root) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  drawTree(ctx, root);
                }
              }
            }}
          />

          {/* Operation Result */}
          {traversalResult.length > 0 && (
            <div className="bg-gray-700 rounded p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Operation Result</h3>
              <div className="flex flex-wrap gap-2">
                {traversalResult.map((value, index) => (
                  <motion.div
                    key={index}
                    className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {value}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Code Section */}
          <div className="bg-gray-700 rounded p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Implementation Code</h3>
            <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto">
              {getOperationCode(operationType)}
            </pre>
          </div>

          {/* Complexity Analysis */}
          {getTimeComplexityGraph()}
        </div>
      </div>
    </div>
  );
};

export default Trees;
