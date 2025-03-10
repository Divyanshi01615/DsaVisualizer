import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Activity {
  id: number;
  start: number;
  finish: number;
  selected?: boolean;
}

interface KnapsackItem {
  id: number;
  weight: number;
  value: number;
  selected?: boolean;
  fraction?: number;
}

interface HuffmanNode {
  char: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  code?: string;
}

interface Job {
  id: number;
  deadline: number;
  profit: number;
  selected?: boolean;
}

const Greedy = () => {
  // State
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, start: 1, finish: 4 },
    { id: 2, start: 3, finish: 5 },
    { id: 3, start: 0, finish: 6 },
    { id: 4, start: 5, finish: 7 },
    { id: 5, start: 3, finish: 8 },
    { id: 6, start: 5, finish: 9 },
    { id: 7, start: 6, finish: 10 },
    { id: 8, start: 8, finish: 11 },
    { id: 9, start: 8, finish: 12 },
    { id: 10, start: 2, finish: 13 },
  ]);

  const [knapsackItems, setKnapsackItems] = useState<KnapsackItem[]>([
    { id: 1, weight: 2, value: 40 },
    { id: 2, weight: 3, value: 50 },
    { id: 3, weight: 4, value: 70 },
    { id: 4, weight: 5, value: 60 },
  ]);

  const [huffmanNodes, setHuffmanNodes] = useState<HuffmanNode[]>([
    { char: 'a', freq: 5 },
    { char: 'b', freq: 9 },
    { char: 'c', freq: 12 },
    { char: 'd', freq: 13 },
    { char: 'e', freq: 16 },
    { char: 'f', freq: 45 },
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, deadline: 4, profit: 20 },
    { id: 2, deadline: 1, profit: 10 },
    { id: 3, deadline: 1, profit: 40 },
    { id: 4, deadline: 1, profit: 30 },
  ]);

  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('activitySelection');
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const maxWeight = 10;
  const [huffmanTree, setHuffmanTree] = useState<HuffmanNode | null>(null);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [showTheory, setShowTheory] = useState(true);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Activity Selection Algorithm
  const activitySelection = async () => {
    setIsRunning(true);
    const sortedActivities = [...activities].sort((a, b) => a.finish - b.finish);
    setActivities(sortedActivities.map(a => ({ ...a, selected: false })));
    await sleep(1000);

    let lastSelected = -1;
    const selected: Activity[] = [];

    for (let i = 0; i < sortedActivities.length; i++) {
      setCurrentStep(i);
      await sleep(1000);

      if (lastSelected === -1 || sortedActivities[i].start >= sortedActivities[lastSelected].finish) {
        sortedActivities[i].selected = true;
        selected.push(sortedActivities[i]);
        lastSelected = i;
      }

      setActivities([...sortedActivities]);
    }

    setCurrentStep(-1);
    setIsRunning(false);
  };

  // Fractional Knapsack Algorithm
  const fractionalKnapsack = async () => {
    setIsRunning(true);
    setCurrentWeight(0);
    let remainingWeight = maxWeight;
    let totalValue = 0;

    const sortedItems = [...knapsackItems]
      .sort((a, b) => (b.value / b.weight) - (a.value / a.weight))
      .map(item => ({ ...item, selected: false, fraction: 0 }));

    setKnapsackItems(sortedItems);
    await sleep(1000);

    for (let i = 0; i < sortedItems.length && remainingWeight > 0; i++) {
      setCurrentStep(i);
      await sleep(1000);

      const item = sortedItems[i];
      const fraction = Math.min(1, remainingWeight / item.weight);
      
      item.selected = true;
      item.fraction = fraction;
      
      const itemValue = item.value * fraction;
      totalValue += itemValue;
      remainingWeight -= item.weight * fraction;
      setCurrentWeight(maxWeight - remainingWeight);
      
      setKnapsackItems([...sortedItems]);
      await sleep(1000);
    }

    alert(`Total Value: ${totalValue.toFixed(2)}`);
    setIsRunning(false);
  };

  // Huffman Coding Algorithm
  const huffmanCoding = async () => {
    setIsRunning(true);
    let nodes = [...huffmanNodes].map(node => ({ ...node }));
    
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      
      const newNode: HuffmanNode = {
        char: left.char + right.char,
        freq: left.freq + right.freq,
        left,
        right
      };
      
      nodes.push(newNode);
      setHuffmanTree({ ...newNode });
      await sleep(1000);
    }
    
    const generateCodes = (node: HuffmanNode, code: string = '') => {
      if (!node.left && !node.right) {
        node.code = code;
        return;
      }
      
      if (node.left) generateCodes(node.left, code + '0');
      if (node.right) generateCodes(node.right, code + '1');
    };
    
    generateCodes(nodes[0]);
    setHuffmanTree(nodes[0]);
    
    setIsRunning(false);
  };

  // Job Sequencing Algorithm
  const jobSequencing = async () => {
    setIsRunning(true);
    setTotalProfit(0);
    
    const sortedJobs = [...jobs]
      .sort((a, b) => b.profit - a.profit)
      .map(job => ({ ...job, selected: false }));
    
    const maxDeadline = Math.max(...sortedJobs.map(job => job.deadline));
    const timeSlots = new Array(maxDeadline).fill(-1);
    let currentProfit = 0;
    
    setJobs(sortedJobs);
    await sleep(1000);
    
    for (let i = 0; i < sortedJobs.length; i++) {
      setCurrentStep(i);
      const job = sortedJobs[i];
      
      for (let j = job.deadline - 1; j >= 0; j--) {
        if (timeSlots[j] === -1) {
          timeSlots[j] = job.id;
          job.selected = true;
          currentProfit += job.profit;
          setTotalProfit(currentProfit);
          break;
        }
      }
      
      setJobs([...sortedJobs]);
      await sleep(1000);
    }
    
    setIsRunning(false);
  };

  const renderHuffmanTree = (node: HuffmanNode | null, x: number, y: number, level: number = 0) => {
    if (!node) return null;

    const spacing = 120 / (level + 1);
    
    return (
      <g key={node.char}>
        <motion.circle
          cx={x}
          cy={y}
          r={20}
          fill="#4B5563"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <text x={x} y={y} textAnchor="middle" dy=".3em" fill="white" fontSize="12">
          {node.char}
        </text>
        {node.code && (
          <text x={x} y={y + 30} textAnchor="middle" fill="white" fontSize="10">
            {node.code}
          </text>
        )}
        {node.left && (
          <>
            <line
              x1={x}
              y1={y + 20}
              x2={x - spacing}
              y2={y + 60}
              stroke="#6B7280"
              strokeWidth="2"
            />
            {renderHuffmanTree(node.left, x - spacing, y + 80, level + 1)}
          </>
        )}
        {node.right && (
          <>
            <line
              x1={x}
              y1={y + 20}
              x2={x + spacing}
              y2={y + 60}
              stroke="#6B7280"
              strokeWidth="2"
            />
            {renderHuffmanTree(node.right, x + spacing, y + 80, level + 1)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Greedy Algorithms</h1>

      {/* Theory Sections */}
      {showTheory && (
        <div className="space-y-6 mb-8">
          {/* Introduction */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction to Greedy Algorithms</h2>
            <p className="text-gray-300">
              A greedy algorithm is an approach for solving a problem by selecting the best option available at the moment.
              It doesn't worry whether the current best result will bring the overall optimal result.
              The algorithm never reverses the earlier decision even if the choice is wrong. It works in a top-down approach.
              This algorithm may not produce the best result for all the problems. It's because it always goes for the local
              best choice to produce the global best result.
            </p>
          </div>

          {/* Properties */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Properties of Greedy Algorithm</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Greedy Choice Property</h3>
                <p className="text-gray-300">
                  If an optimal solution to the problem can be found by choosing the best choice at each step without
                  reconsidering the previous steps once chosen, the problem can be solved using a greedy approach.
                  This property is called greedy choice property.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Optimal Substructure</h3>
                <p className="text-gray-300">
                  If the optimal overall solution to the problem corresponds to the optimal solution to its subproblems,
                  then the problem can be solved using a greedy approach. This property is called optimal substructure.
                </p>
              </div>
            </div>
          </div>

          {/* Components */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Components of Greedy Algorithm</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• <span className="font-semibold">Candidate set:</span> A solution that is created from the set is known as a candidate set.</li>
              <li>• <span className="font-semibold">Selection function:</span> This function is used to choose the candidate or subset which can be added in the solution.</li>
              <li>• <span className="font-semibold">Feasibility function:</span> A function that is used to determine whether the candidate or subset can be used to contribute to the solution or not.</li>
              <li>• <span className="font-semibold">Objective function:</span> A function is used to assign the value to the solution or the partial solution.</li>
              <li>• <span className="font-semibold">Solution function:</span> This function is used to intimate whether the complete function has been reached or not.</li>
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Greedy Algorithm Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>To begin with, the solution set (containing answers) is empty.</li>
              <li>At each step, an item is added to the solution set until a solution is reached.</li>
              <li>If the solution set is feasible, the current item is kept.</li>
              <li>Else, the item is rejected and never considered again.</li>
            </ol>
          </div>

          {/* Applications */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Applications of Greedy Algorithm</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Selection Sort</li>
              <li>• Fractional Knapsack Problem</li>
              <li>• Minimum Spanning Tree (Prim's, Kruskal's)</li>
              <li>• Single-Source Shortest Path Problem</li>
              <li>• Job Scheduling Problem</li>
              <li>• Huffman Coding</li>
              <li>• Ford-Fulkerson Algorithm</li>
            </ul>
          </div>

          {/* Advantages and Disadvantages */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Advantages and Disadvantages</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Advantages</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• The algorithm is easier to describe.</li>
                  <li>• This algorithm can perform better than other algorithms (but, not in all cases).</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Disadvantages</h3>
                <p className="text-gray-300">
                  As mentioned earlier, the greedy algorithm doesn't always produce the optimal solution.
                  This is the major disadvantage of the algorithm.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Selection */}
      <div className="mb-8 flex flex-wrap gap-4">
        {['activitySelection', 'fractionalKnapsack', 'huffmanCoding', 'jobSequencing'].map((algo) => (
          <button
            key={algo}
            onClick={() => setSelectedAlgorithm(algo)}
            className={`px-6 py-2 rounded transition-colors ${
              selectedAlgorithm === algo
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {algo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Algorithm Implementation and Visualization */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedAlgorithm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </h2>
          <button
            onClick={() => {
              switch (selectedAlgorithm) {
                case 'activitySelection':
                  activitySelection();
                  break;
                case 'fractionalKnapsack':
                  fractionalKnapsack();
                  break;
                case 'huffmanCoding':
                  huffmanCoding();
                  break;
                case 'jobSequencing':
                  jobSequencing();
                  break;
              }
            }}
            disabled={isRunning}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Start Algorithm
          </button>
        </div>

        

        {/* Visualization */}
        <div className="relative h-96 bg-gray-900 rounded-lg p-4">
          {selectedAlgorithm === 'activitySelection' && (
            <div className="relative h-full">
              <div className="absolute inset-x-0 bottom-0 h-12 flex items-center justify-between px-4">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="text-gray-400 text-sm">{i}</div>
                ))}
              </div>
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: 1,
                      y: index * 40,
                      backgroundColor: activity.selected 
                        ? '#10B981' 
                        : index === currentStep 
                        ? '#FBBF24' 
                        : '#3B82F6'
                    }}
                    exit={{ opacity: 0 }}
                    className="absolute h-8 rounded-md"
                    style={{
                      left: `${(activity.start / 13) * 100}%`,
                      width: `${((activity.finish - activity.start) / 13) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                      {activity.start}-{activity.finish}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {selectedAlgorithm === 'fractionalKnapsack' && (
            <>
              <motion.div
                className="h-4 bg-green-500 rounded-full mb-8"
                initial={{ width: 0 }}
                animate={{ width: `${(currentWeight / maxWeight) * 100}%` }}
              >
                <div className="text-white text-xs absolute right-0 top-4">
                  {currentWeight.toFixed(1)}/{maxWeight}kg
                </div>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {knapsackItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`p-4 rounded-lg ${
                      item.selected
                        ? 'bg-green-500'
                        : index === currentStep
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 1,
                      opacity: 1,
                      backgroundColor: item.selected 
                        ? '#10B981' 
                        : index === currentStep 
                        ? '#FBBF24' 
                        : '#3B82F6'
                    }}
                  >
                    <div className="text-white">
                      <div>Weight: {item.weight}kg</div>
                      <div>Value: ${item.value}</div>
                      <div>Ratio: {(item.value / item.weight).toFixed(2)}</div>
                      {item.fraction !== undefined && item.fraction > 0 && (
                        <div>Used: {(item.fraction * 100).toFixed(0)}%</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {selectedAlgorithm === 'huffmanCoding' && (
            <svg width="100%" height="100%" viewBox="0 0 800 400">
              {huffmanTree && renderHuffmanTree(huffmanTree, 400, 40)}
            </svg>
          )}

          {selectedAlgorithm === 'jobSequencing' && (
            <>
              <div className="text-white text-xl mb-4">
                Total Profit: ${totalProfit}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    className={`p-4 rounded-lg ${
                      job.selected
                        ? 'bg-green-500'
                        : index === currentStep
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 1,
                      opacity: 1,
                      backgroundColor: job.selected 
                        ? '#10B981' 
                        : index === currentStep 
                        ? '#FBBF24' 
                        : '#3B82F6'
                    }}
                  >
                    <div className="text-white">
                      <div>Job {job.id}</div>
                      <div>Deadline: {job.deadline}</div>
                      <div>Profit: ${job.profit}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Algorithm Code */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Algorithm Implementation</h3>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-gray-300">
            {selectedAlgorithm === 'activitySelection' && `
function activitySelection(activities) {
  // Sort activities by finish time
  activities.sort((a, b) => a.finish - b.finish);
  
  const selected = [activities[0]];
  let lastSelected = 0;
  
  // Select activities that don't overlap
  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= activities[lastSelected].finish) {
      selected.push(activities[i]);
      lastSelected = i;
    }
  }
  
  return selected;
}`}
            {selectedAlgorithm === 'fractionalKnapsack' && `
function fractionalKnapsack(items, capacity) {
  // Calculate value/weight ratio and sort
  items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  
  let totalValue = 0;
  let currentWeight = 0;
  
  for (let item of items) {
    if (currentWeight + item.weight <= capacity) {
      // Take whole item
      currentWeight += item.weight;
      totalValue += item.value;
    } else {
      // Take fraction of item
      const remainingWeight = capacity - currentWeight;
      totalValue += item.value * (remainingWeight / item.weight);
      break;
    }
  }
  
  return totalValue;
}`}
            {selectedAlgorithm === 'huffmanCoding' && `
class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

function huffmanCoding(frequencies) {
  // Create leaf nodes and sort by frequency
  const heap = frequencies
    .map(f => new HuffmanNode(f.char, f.freq))
    .sort((a, b) => a.freq - b.freq);
  
  // Build Huffman tree
  while (heap.length > 1) {
    const left = heap.shift();
    const right = heap.shift();
    
    const newNode = new HuffmanNode(
      left.char + right.char,
      left.freq + right.freq,
      left,
      right
    );
    
    heap.push(newNode);
    heap.sort((a, b) => a.freq - b.freq);
  }
  
  // Generate codes by traversing tree
  function generateCodes(node, code = "") {
    if (!node.left && !node.right) {
      return { [node.char]: code };
    }
    
    return {
      ...(node.left ? generateCodes(node.left, code + "0") : {}),
      ...(node.right ? generateCodes(node.right, code + "1") : {})
    };
  }
  
  return generateCodes(heap[0]);
}`}
            {selectedAlgorithm === 'jobSequencing' && `
function jobSequencing(jobs) {
  // Sort jobs by profit in descending order
  jobs.sort((a, b) => b.profit - a.profit);
  
  const maxDeadline = Math.max(...jobs.map(j => j.deadline));
  const slots = new Array(maxDeadline).fill(-1);
  const sequence = [];
  let totalProfit = 0;
  
  for (let job of jobs) {
    // Find available slot from deadline backwards
    for (let t = job.deadline - 1; t >= 0; t--) {
      if (slots[t] === -1) {
        slots[t] = job.id;
        sequence.push(job.id);
        totalProfit += job.profit;
        break;
      }
    }
  }
  
  return { sequence, totalProfit };
}`}
          </pre>
        </div>

        {/* Complexity Information */}
        <div className="mt-8 bg-gray-700 rounded p-4">
          <h3 className="text-xl font-semibold text-white mb-4">Time Complexity</h3>
          <div className="space-y-2 text-gray-300">
            {selectedAlgorithm === 'activitySelection' && (
              <>
                <p>• Sorting activities: O(n log n)</p>
                <p>• Selection process: O(n)</p>
                <p>• Overall: O(n log n)</p>
              </>
            )}
            {selectedAlgorithm === 'fractionalKnapsack' && (
              <>
                <p>• Sorting by value/weight ratio: O(n log n)</p>
                <p>• Selection process: O(n)</p>
                <p>• Overall: O(n log n)</p>
              </>
            )}
            {selectedAlgorithm === 'huffmanCoding' && (
              <>
                <p>• Building min heap: O(n)</p>
                <p>• Extract min operations: O(n log n)</p>
                <p>• Overall: O(n log n)</p>
              </>
            )}
            {selectedAlgorithm === 'jobSequencing' && (
              <>
                <p>• Sorting by profit: O(n log n)</p>
                <p>• Finding slots: O(n²)</p>
                <p>• Overall: O(n²)</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Greedy;