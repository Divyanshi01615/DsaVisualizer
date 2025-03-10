import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const DynamicProgramming = () => {
  const [n, setN] = useState<number>(5);
  const [maxWeight, setMaxWeight] = useState<number>(10);
  const [knapsackItems, setKnapsackItems] = useState<{ values: number[], weights: number[] }>({
    values: [60, 100, 120],
    weights: [10, 20, 30]
  });
  const [dpTable, setDpTable] = useState<number[]>([]);
  const [dpMatrix, setDpMatrix] = useState<number[][]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('fibonacci');
  const [algorithmInfo, setAlgorithmInfo] = useState<{
    title: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    pseudocode: string[];
  }>({
    title: "Fibonacci Sequence",
    description: "Calculates the nth Fibonacci number using dynamic programming.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    pseudocode: [
      "function fibonacci(n):",
      "  Create array dp[0...n]",
      "  dp[0] = 0, dp[1] = 1",
      "  for i from 2 to n:",
      "    dp[i] = dp[i-1] + dp[i-2]",
      "  return dp[n]"
    ]
  });
  
  // Input data for visualizations
  const [lisArray] = useState<number[]>([10, 22, 9, 33, 21, 50, 41, 60, 80]);
  const [lcsStrings] = useState<{str1: string, str2: string}>({
    str1: "ABCBDAB",
    str2: "BDCABA"
  });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Update algorithm info when algorithm changes
  React.useEffect(() => {
    switch (selectedAlgorithm) {
      case 'fibonacci':
        setAlgorithmInfo({
          title: "Fibonacci Sequence",
          description: "Calculates the nth Fibonacci number using dynamic programming.",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          pseudocode: [
            "function fibonacci(n):",
            "  Create array dp[0...n]",
            "  dp[0] = 0, dp[1] = 1",
            "  for i from 2 to n:",
            "    dp[i] = dp[i-1] + dp[i-2]",
            "  return dp[n]"
          ]
        });
        break;
      case 'knapsack':
        setAlgorithmInfo({
          title: "0/1 Knapsack Problem",
          description: "Finds the maximum value subset of items that fit into a knapsack of capacity W.",
          timeComplexity: "O(n*W) where n is the number of items and W is the capacity",
          spaceComplexity: "O(n*W)",
          pseudocode: [
            "function knapsack(values[], weights[], n, W):",
            "  Create table dp[0...n][0...W]",
            "  Initialize all entries as 0",
            "  for i from 1 to n:",
            "    for w from 1 to W:",
            "      if weights[i-1] <= w:",
            "        dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])",
            "      else:",
            "        dp[i][w] = dp[i-1][w]",
            "  return dp[n][W]"
          ]
        });
        break;
      case 'lcs':
        setAlgorithmInfo({
          title: "Longest Common Subsequence",
          description: "Finds the length of the longest subsequence present in both strings.",
          timeComplexity: "O(m*n) where m and n are the lengths of the two strings",
          spaceComplexity: "O(m*n)",
          pseudocode: [
            "function LCS(X, Y, m, n):",
            "  Create table dp[0...m][0...n]",
            "  Initialize all entries as 0",
            "  for i from 1 to m:",
            "    for j from 1 to n:",
            "      if X[i-1] == Y[j-1]:",
            "        dp[i][j] = dp[i-1][j-1] + 1",
            "      else:",
            "        dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
            "  return dp[m][n]"
          ]
        });
        break;
      case 'lis':
        setAlgorithmInfo({
          title: "Longest Increasing Subsequence",
          description: "Finds the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.",
          timeComplexity: "O(n²)",
          spaceComplexity: "O(n)",
          pseudocode: [
            "function LIS(arr, n):",
            "  Create array dp[0...n-1]",
            "  Initialize all values in dp as 1",
            "  for i from 1 to n-1:",
            "    for j from 0 to i-1:",
            "      if arr[i] > arr[j] and dp[i] < dp[j] + 1:",
            "        dp[i] = dp[j] + 1",
            "  return maximum value in dp[]"
          ]
        });
        break;
      default:
        break;
    }
  }, [selectedAlgorithm]);

  // Fibonacci Sequence Algorithm
  const calculateFibonacci = async () => {
    setIsCalculating(true);
    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    setDpTable([...dp]);
    setCurrentIndex(1);
    await sleep(500);

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      setDpTable([...dp]);
      setCurrentIndex(i);
      await sleep(500);
    }

    setCurrentIndex(-1);
    setIsCalculating(false);
  };

  // 0/1 Knapsack Algorithm with Animation
  const calculateKnapsack = async () => {
    setIsCalculating(true);
    const { values, weights } = knapsackItems;
    const numItems = values.length;
    const dp = Array.from({ length: numItems + 1 }, () => new Array(maxWeight + 1).fill(0));
    
    setDpMatrix([...dp]);
    await sleep(500);

    for (let i = 1; i <= numItems; i++) {
      for (let w = 1; w <= maxWeight; w++) {
        setCurrentCell([i, w]);
        
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(
            values[i - 1] + dp[i - 1][w - weights[i - 1]], 
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }

        setDpMatrix([...dp]);
        await sleep(200);
      }
    }

    setCurrentCell(null);
    setIsCalculating(false);
  };

  // Longest Common Subsequence Algorithm with Animation
  const calculateLCS = async () => {
    setIsCalculating(true);
    const text1 = lcsStrings.str1;
    const text2 = lcsStrings.str2;
    
    const dp = Array.from({ length: text1.length + 1 }, () => 
      new Array(text2.length + 1).fill(0)
    );
    
    setDpMatrix([...dp]);
    await sleep(500);

    for (let i = 1; i <= text1.length; i++) {
      for (let j = 1; j <= text2.length; j++) {
        setCurrentCell([i, j]);
        
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }

        setDpMatrix([...dp]);
        await sleep(200);
      }
    }

    setCurrentCell(null);
    setIsCalculating(false);
  };

  // Longest Increasing Subsequence Algorithm with Animation
  const calculateLIS = async () => {
    setIsCalculating(true);
    const arr = lisArray;
    const n = arr.length;
    
    const dp = new Array(n).fill(1);
    setDpTable([...dp]);
    await sleep(500);

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        setCurrentIndex(i);
        
        if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
          dp[i] = dp[j] + 1;
          setDpTable([...dp]);
          await sleep(300);
        }
      }
    }

    setCurrentIndex(-1);
    setIsCalculating(false);
  };

  // Start the selected algorithm
  const startAlgorithm = async () => {
    setDpTable([]);
    setDpMatrix([]);
    setCurrentIndex(-1);
    setCurrentCell(null);
    
    switch (selectedAlgorithm) {
      case 'fibonacci':
        await calculateFibonacci();
        break;
      case 'knapsack':
        await calculateKnapsack();
        break;
      case 'lcs':
        await calculateLCS();
        break;
      case 'lis':
        await calculateLIS();
        break;
      default:
        break;
    }
  };

  // Render DP Matrix for 2D algorithms
  const renderDpMatrix = () => {
    if (!dpMatrix.length) return null;
    
    return (
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {dpMatrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <motion.td
                    key={`${i}-${j}`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      backgroundColor: currentCell && currentCell[0] === i && currentCell[1] === j 
                        ? '#FBBF24' 
                        : cell > 0 ? '#10B981' : '#3B82F6'
                    }}
                    className="w-12 h-12 text-center border border-gray-700 text-white"
                  >
                    {cell}
                  </motion.td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render input data display based on selected algorithm
  const renderInputData = () => {
    switch (selectedAlgorithm) {
      case 'fibonacci':
        return (
          <div className="bg-gray-700 p-3 rounded mb-4">
            <h3 className="text-white font-semibold mb-2">Input:</h3>
            <p className="text-gray-300">n = {n}</p>
          </div>
        );
      case 'knapsack':
        return (
          <div className="bg-gray-700 p-3 rounded mb-4">
            <h3 className="text-white font-semibold mb-2">Input:</h3>
            <p className="text-gray-300">Max Weight: {maxWeight}</p>
            <div className="mt-2">
              <p className="text-gray-300">Items:</p>
              <table className="w-full mt-1 text-gray-300">
                <thead>
                  <tr>
                    <th className="text-left">Item</th>
                    <th className="text-left">Value</th>
                    <th className="text-left">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {knapsackItems.values.map((value, idx) => (
                    <tr key={idx}>
                      <td>Item {idx + 1}</td>
                      <td>{value}</td>
                      <td>{knapsackItems.weights[idx]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'lcs':
        return (
          <div className="bg-gray-700 p-3 rounded mb-4">
            <h3 className="text-white font-semibold mb-2">Input:</h3>
            <p className="text-gray-300">String 1: "{lcsStrings.str1}"</p>
            <p className="text-gray-300">String 2: "{lcsStrings.str2}"</p>
          </div>
        );
      case 'lis':
        return (
          <div className="bg-gray-700 p-3 rounded mb-4">
            <h3 className="text-white font-semibold mb-2">Input:</h3>
            <p className="text-gray-300">Array: [{lisArray.join(', ')}]</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Dynamic Programming</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Info className="text-blue-400 mr-2" size={20} />
          <h2 className="text-xl font-semibold text-white">What is Dynamic Programming?</h2>
        </div>
        <p className="text-gray-300">
          Dynamic Programming is a technique in computer programming that helps to efficiently solve problems 
          that have overlapping subproblems and optimal substructure properties. It works by breaking down a 
          complex problem into simpler subproblems, solving each subproblem only once, and storing the solutions 
          to avoid redundant calculations.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white">Characteristics of Dynamic Programming</h2>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Optimal Substructure</h3>
          <p className="mt-2 text-gray-300">
            A problem has an Optimal Substructure property if the optimal solution can be obtained by using optimal
            solutions of its subproblems. Example: The Shortest Path problem follows this property.
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Overlapping Subproblems</h3>
          <p className="mt-2 text-gray-300">
            Dynamic Programming is used when solutions to the same subproblems are needed multiple times. Computed
            solutions are stored to avoid recomputation, making DP efficient.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white">Tabulation and Memoization</h2>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Tabulation Method – Bottom-Up DP</h3>
          <p className="mt-2 text-gray-300">
            This method starts solving the problem from the base case and builds up to the desired solution. It
            follows a bottom-up approach by filling up a DP table.
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Memoization Method – Top-Down DP</h3>
          <p className="mt-2 text-gray-300">
            This method starts from the desired solution and recursively computes results using already stored
            computed values. It follows a top-down approach with recursion and caching.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white">How to Solve a Dynamic Programming Problem</h2>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Step 1: Classifying as a DP Problem</h3>
          <p className="mt-2 text-gray-300">
            Problems that require optimization (maximization/minimization) or counting possible arrangements often
            indicate the use of DP. Look for overlapping subproblems and optimal substructure.
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Step 2: Deciding the State</h3>
          <p className="mt-2 text-gray-300">
            The state is a set of parameters uniquely identifying the problem at a certain stage. Example: In the
            Knapsack problem, the state is defined by <code>DP[index][weight]</code>, representing the maximum profit
            possible considering items from <code>0</code> to <code>index</code> with a given weight capacity.
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Step 3: Formulating State Transition</h3>
          <p className="mt-2 text-gray-300">
            This is the most challenging part and requires observation and intuition. The goal is to define how the
            current state depends on previous states.
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-xl font-medium text-white">Step 4: Applying Memoization or Tabulation</h3>
          <p className="mt-2 text-gray-300">
            The final step is storing computed state values to avoid redundant calculations, making the solution
            efficient.
          </p>
        </div>
      </div>
      
      {/* Algorithm Selector */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setSelectedAlgorithm('fibonacci')}
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'fibonacci' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Fibonacci
        </button>
        <button
          onClick={() => setSelectedAlgorithm('knapsack')}
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'knapsack' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          0/1 Knapsack
        </button>
        <button
          onClick={() => setSelectedAlgorithm('lcs')}
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'lcs' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          LCS
        </button>
        <button
          onClick={() => setSelectedAlgorithm('lis')}
          className={`px-6 py-2 rounded transition-colors ${
            selectedAlgorithm === 'lis' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          LIS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Algorithm Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">{algorithmInfo.title}</h2>
          <p className="text-gray-300 mb-4">{algorithmInfo.description}</p>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Time Complexity</h3>
            <p className="text-gray-300 bg-gray-700 p-2 rounded">{algorithmInfo.timeComplexity}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Space Complexity</h3>
            <p className="text-gray-300 bg-gray-700 p-2 rounded">{algorithmInfo.spaceComplexity}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Pseudocode</h3>
            <div className="bg-gray-700 p-3 rounded">
              {algorithmInfo.pseudocode.map((line, index) => (
                <pre key={index} className="text-gray-300 font-mono text-sm">{line}</pre>
              ))}
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Visualization</h2>
          
          {/* Inputs for different algorithms */}
          <div className="mb-6">
            {selectedAlgorithm === 'fibonacci' && (
              <div className="flex gap-4 items-center">
                <label className="text-white">n:</label>
                <input
                  type="number"
                  value={n}
                  onChange={(e) => setN(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="20"
                  className="px-4 py-2 rounded bg-gray-700 text-white w-24"
                />
              </div>
            )}
            
            {selectedAlgorithm === 'knapsack' && (
              <div className="flex gap-4 items-center">
                <label className="text-white">Max Weight:</label>
                <input
                  type="number"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="px-4 py-2 rounded bg-gray-700 text-white w-24"
                />
              </div>
            )}
            
            <button
              onClick={startAlgorithm}
              disabled={isCalculating}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : 'Visualize'}
            </button>
          </div>
          
          {/* Input data display */}
          {renderInputData()}
          
          {/* Visualization area */}
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            {/* 1D DP Table Visualization */}
            {(selectedAlgorithm === 'fibonacci' || selectedAlgorithm === 'lis') && dpTable.length > 0 && (
              <div>
                {selectedAlgorithm === 'lis' && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {lisArray.map((value, index) => (
                      <div 
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${
                          index === currentIndex ? 'bg-yellow-500' : 'bg-gray-700'
                        }`}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {dpTable.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: 1,
                        backgroundColor: index === currentIndex 
                          ? '#FBBF24' // yellow
                          : value > 0 ? '#10B981' : '#3B82F6' // green or blue
                      }}
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 2D DP Table Visualization */}
            {(selectedAlgorithm === 'knapsack' || selectedAlgorithm === 'lcs') && dpMatrix.length > 0 && (
              <div>
                {selectedAlgorithm === 'lcs' && (
                  <div className="mb-4">
                    <div className="flex mb-2">
                      <div className="w-12 h-12"></div>
                      {lcsStrings.str2.split('').map((char, idx) => (
                        <div 
                          key={idx}
                          className="w-12 h-12 flex items-center justify-center text-white bg-gray-700"
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      {lcsStrings.str1.split('').map((char, idx) => (
                        <div 
                          key={idx}
                          className="w-12 h-12 flex items-center justify-center text-white bg-gray-700 mb-2"
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {renderDpMatrix()}
              </div>
            )}
            
            {!isCalculating && dpTable.length === 0 && dpMatrix.length === 0 && (
              <div className="text-gray-400 text-center py-8">
                Click "Visualize" to see the algorithm in action
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProgramming;