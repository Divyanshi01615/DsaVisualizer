import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Backtracking = () => {
  // State for toggling between problems
  const [activeSection, setActiveSection] = useState<'nQueens' | 'sudoku' | 'knapsack' | 'graphColoring'>('nQueens');
  
  // State to show extra content
  const [showContent, setShowContent] = useState(false);

  // N-Queens Setup
  const [board, setBoard] = useState<number[][]>(Array(8).fill(0).map(() => Array(8).fill(0)));
  const [currentQueen, setCurrentQueen] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const isSafe = (board: number[][], row: number, col: number): boolean => {
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 1) return false;
    }
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    for (let i = row, j = col; i < 8 && j >= 0; i++, j--) {
      if (board[i][j] === 1) return false;
    }
    return true;
  };

  const solveNQueens = async (board: number[][], col: number): Promise<boolean> => {
    if (col >= 8) return true;

    setCurrentQueen(col);
    await sleep(500);

    for (let i = 0; i < 8; i++) {
      if (isSafe(board, i, col)) {
        const newBoard = board.map(row => [...row]);
        newBoard[i][col] = 1;
        setBoard(newBoard);
        await sleep(500);

        if (await solveNQueens(newBoard, col + 1)) {
          return true;
        }

        const resetBoard = newBoard.map(row => [...row]);
        resetBoard[i][col] = 0;
        setBoard(resetBoard);
        await sleep(500);
      }
    }

    return false;
  };

  const startSolvingNQueens = async () => {
    setIsRunning(true);
    const newBoard = Array(8).fill(0).map(() => Array(8).fill(0));
    setBoard(newBoard);
    await solveNQueens(newBoard, 0);
    setCurrentQueen(-1);
    setIsRunning(false);
    setShowContent(true);
  };

  // Sudoku Setup
  const [sudokuBoard, setSudokuBoard] = useState<number[][]>([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);
  const [isSudokuRunning, setIsSudokuRunning] = useState(false);

  const isSudokuSafe = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }

    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  };

  const solveSudoku = async (board: number[][]): Promise<boolean> => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSudokuSafe(board, row, col, num)) {
              const newBoard = board.map(r => [...r]);
              newBoard[row][col] = num;
              setSudokuBoard(newBoard);
              await sleep(500);

              if (await solveSudoku(newBoard)) {
                return true;
              }

              const resetBoard = newBoard.map(r => [...r]);
              resetBoard[row][col] = 0;
              setSudokuBoard(resetBoard);
              await sleep(500);
            }
          }

          return false;
        }
      }
    }

    return true;
  };

  const startSolvingSudoku = async () => {
    setIsSudokuRunning(true);
    const newBoard = sudokuBoard.map(row => [...row]);
    await solveSudoku(newBoard);
    setIsSudokuRunning(false);
    setShowContent(true);
  };

  // Knapsack Setup
  const [knapsackItems, setKnapsackItems] = useState([
    { value: 60, weight: 10 },
    { value: 100, weight: 20 },
    { value: 120, weight: 30 }
  ]);
  const [knapsackCapacity, setKnapsackCapacity] = useState(50);
  const [knapsackSolution, setKnapsackSolution] = useState<number[]>([]);
  const [knapsackAnimation, setKnapsackAnimation] = useState<{
    currentStep: number;
    totalSteps: number;
    dp: number[][];
    selectedItems: number[];
  }>({
    currentStep: 0,
    totalSteps: 0,
    dp: [],
    selectedItems: []
  });
  const [isKnapsackRunning, setIsKnapsackRunning] = useState(false);

  const solveKnapsack = async () => {
    setIsKnapsackRunning(true);
    
    // Initialize DP table
    let dp: number[][] = Array(knapsackItems.length + 1).fill(null).map(() => Array(knapsackCapacity + 1).fill(0));
    
    // Animation steps
    let steps = 0;
    const totalSteps = (knapsackItems.length * knapsackCapacity) + knapsackItems.length;
    
    // Build the DP table with animation
    for (let i = 1; i <= knapsackItems.length; i++) {
      for (let w = 1; w <= knapsackCapacity; w++) {
        steps++;
        
        if (knapsackItems[i - 1].weight <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - knapsackItems[i - 1].weight] + knapsackItems[i - 1].value);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
        
        // Update animation state
        setKnapsackAnimation({
          currentStep: steps,
          totalSteps,
          dp: dp.map(row => [...row]),
          selectedItems: []
        });
        
        await sleep(100);
      }
    }

    // Trace the solution
    let res = dp[knapsackItems.length][knapsackCapacity];
    let w = knapsackCapacity;
    let solution: number[] = [];

    for (let i = knapsackItems.length; i > 0 && res > 0; i--) {
      steps++;
      
      if (res !== dp[i - 1][w]) {
        solution.push(i - 1);
        res -= knapsackItems[i - 1].value;
        w -= knapsackItems[i - 1].weight;
        
        // Update animation with selected items
        setKnapsackAnimation({
          currentStep: steps,
          totalSteps,
          dp: dp.map(row => [...row]),
          selectedItems: [...solution]
        });
        
        await sleep(300);
      }
    }

    setKnapsackSolution(solution.reverse());
    setIsKnapsackRunning(false);
    setShowContent(true);
  };

  // Graph Coloring Setup
  const [graphNodes, setGraphNodes] = useState([
    [0, 1, 0, 1, 0],
    [1, 0, 1, 1, 0],
    [0, 1, 0, 1, 1],
    [1, 1, 1, 0, 1],
    [0, 0, 1, 1, 0]
  ]);
  const [graphColors, setGraphColors] = useState<number[]>(new Array(5).fill(-1));
  const [isGraphColoringRunning, setIsGraphColoringRunning] = useState(false);

  const isGraphColoringSafe = (node: number, color: number): boolean => {
    for (let i = 0; i < graphNodes.length; i++) {
      if (graphNodes[node][i] === 1 && graphColors[i] === color) {
        return false;
      }
    }
    return true;
  };

  const solveGraphColoring = async (node: number): Promise<boolean> => {
    if (node === graphNodes.length) return true;

    for (let color = 0; color < 3; color++) {
      if (isGraphColoringSafe(node, color)) {
        const newColors = [...graphColors];
        newColors[node] = color;
        setGraphColors(newColors);
        await sleep(500);

        if (await solveGraphColoring(node + 1)) {
          return true;
        }

        const resetColors = [...newColors];
        resetColors[node] = -1;
        setGraphColors(resetColors);
        await sleep(500);
      }
    }

    return false;
  };

  const startGraphColoring = async () => {
    setIsGraphColoringRunning(true);
    setGraphColors(new Array(5).fill(-1));
    await solveGraphColoring(0);
    setIsGraphColoringRunning(false);
    setShowContent(true);
  };

  // Reset all animations when changing sections
  useEffect(() => {
    setShowContent(false);
  }, [activeSection]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Backtracking Algorithms</h1>
      
      {/* Scenario Section */}
      <div className="mb-6 p-6 bg-gray-800 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Backtracking Scenario</h2>
        <p>
          Think about a scenario where you are standing outside a maze, and you need to find the exit. Now, you have a couple of ways you can try to find the exit door, uncertain of the outcome. You may either run into some wrong path, backtrack (move back to the starting point) and try to find a new path, or one in many chances, you may land into the correct path and reach your exit door. But out of multiple scenarios, you have only one path (marked in green) which will lead you to the exit door.
        </p>
        <p className="mt-2">
          For any backtracking problem, the backtracking algorithm tries to go through one of the paths to reach the possible solution, and if the path doesn't lead there, then the problem backtracks through the same path and takes another path in search of the solution.
        </p>
      </div>

      {/* Example Section */}
      <div className="mb-6 p-6 bg-gray-800 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Backtracking Example</h2>
        <p>
          To understand this clearly, consider the given example. Suppose you are standing in front of three roads, one of which has a bag of gold at its end, but you don't know which one it is. Firstly, you will go in Path 1, if that is not the one, then come out of it, and go into Path 2, and again if that is not the one, come out of it and go into Path 3. 
        </p>
        <p className="mt-2">
          So, let's say we are standing at 'A' and we divided our problem into three smaller sub-problems 'B', 'D', and 'F'. And using this sub-problem, we have three possible paths to get to our solution — 'C', 'E', and 'G'.
        </p>
      </div>

      {/* Types of Backtracking Problems */}
      <div className="mb-6 p-6 bg-gray-800 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Types of Backtracking Problems</h2>
        <ul className="list-disc pl-5">
          <li><strong>Decision Problem:</strong> In this, we search for a feasible solution.</li>
          <li><strong>Optimization Problem:</strong> In this, we search for the best solution.</li>
          <li><strong>Enumeration Problem:</strong> In this, we find all feasible solutions.</li>
        </ul>
      </div>

      {/* Backtracking Algorithm Properties */}
      <div className="mb-6 p-6 bg-gray-800 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Backtracking Algorithm Properties</h2>
        <p>
          A backtracking algorithm uses the depth-first search method. When it starts exploring the solutions, a bounding function is applied so that the algorithm can check if the so-far built solution satisfies the constraints. If it does, it continues searching. If it doesn't, the branch would be eliminated, and the algorithm goes back to the level before.
        </p>
        <p className="mt-2">
          It uses recursive calling to find a solution set by building a solution step by step, increasing levels with time. In order to find these solutions, a search tree named state-space tree is used. In a state-space tree, each branch is a variable, and each level represents a solution.
        </p>
      </div>

      {/* Applications of Backtracking */}
      <div className="mb-6 p-6 bg-gray-800 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Applications of Backtracking</h2>
        <ul className="list-disc pl-5">
          <li>To find all Hamiltonian Paths present in a graph.</li>
          <li>To solve the N Queen problem.</li>
          <li>Maze solving problem.</li>
          <li>The Knight's tour problem.</li>
          <li>Binary Strings: generating all binary strings.</li>
          <li>Generating k-ary Strings.</li>
          <li>The Knapsack Problem.</li>
          <li>Graph Coloring Problem.</li>
        </ul>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="mb-6 p-6 bg-gray-800 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Advantages and Disadvantages of Backtracking</h2>
        
        <h3 className="font-semibold text-lg mb-2">Advantages:</h3>
        <ul className="list-disc pl-5 mb-4">
          <li>Backtracking can almost solve any problems due to its brute-force nature.</li>
          <li>It is easy to implement and contains fewer lines of code.</li>
        </ul>

        <h3 className="font-semibold text-lg mb-2">Disadvantages:</h3>
        <ul className="list-disc pl-5">
          <li>More optimal algorithms for the given problem may exist.</li>
          <li>When the branching factor is high, it is very time-consuming.</li>
          <li>Large space complexity because recursion stores function information on the stack.</li>
        </ul>
      </div>

      {/* Navigation Bar */}
      <div className="flex flex-wrap space-x-2 md:space-x-6 mb-8">
        <button onClick={() => setActiveSection('nQueens')} className={`px-4 md:px-6 py-2 ${activeSection === 'nQueens' ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded hover:bg-blue-600 transition-colors mb-2`}>N-Queens</button>
        <button onClick={() => setActiveSection('sudoku')} className={`px-4 md:px-6 py-2 ${activeSection === 'sudoku' ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded hover:bg-blue-600 transition-colors mb-2`}>Sudoku Solver</button>
        <button onClick={() => setActiveSection('knapsack')} className={`px-4 md:px-6 py-2 ${activeSection === 'knapsack' ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded hover:bg-blue-600 transition-colors mb-2`}>Knapsack Problem</button>
        <button onClick={() => setActiveSection('graphColoring')} className={`px-4 md:px-6 py-2 ${activeSection === 'graphColoring' ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded hover:bg-blue-600 transition-colors mb-2`}>Graph Coloring</button>
      </div>

      {/* N-Queens Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'nQueens' && (
          <motion.div 
            key="nQueens"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">N-Queens Problem</h2>
            <button 
              onClick={startSolvingNQueens} 
              disabled={isRunning} 
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-8 transition-colors"
            >
              {isRunning ? 'Solving...' : 'Solve 8-Queens'}
            </button>
            
            <motion.div className="grid grid-cols-8 gap-1 w-full max-w-md mx-auto mb-8">
              {board.map((row, i) => row.map((cell, j) => (
                <motion.div 
                  key={`${i}-${j}`} 
                  className={`aspect-square rounded ${(i + j) % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'} flex items-center justify-center`}
                  animate={{ 
                    backgroundColor: cell === 1 ? '#10B981' : (i + j) % 2 === 0 ? '#4B5563' : '#374151',
                    scale: cell === 1 ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {cell === 1 && (
                    <motion.div 
                      className="w-8 h-8 bg-yellow-400 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </motion.div>
              )))}
            </motion.div>

            {/* Problem Statement */}
            <div className="text-white mb-6">
              <h3 className="text-xl font-semibold mb-2">Problem Statement:</h3>
              <p>
                The N-Queens problem is a classical problem in computer science where the objective is to place N chess queens on an N x N chessboard such that no two queens threaten each other. This means that no two queens can share the same row, column, or diagonal.
              </p>
            </div>

            {/* Implementation */}
            <div className="text-white mb-6">
              <h3 className="text-xl font-semibold mb-2">Implementation:</h3>
              <p>
                The algorithm used to solve this problem is a backtracking algorithm. The idea is to place a queen in a row, and then recursively place queens in subsequent rows, ensuring that they do not threaten each other. If a valid placement is not found, the algorithm backtracks and tries placing the queen in a different position.
              </p><br />
              <pre className="bg-gray-700 p-4 rounded text-white overflow-x-auto">
                <code>
                  {`function solveNQueens(board, col) {
  if (col >= N) {
    return true; // All queens are placed
  }
  
  for (let row = 0; row < N; row++) {
    if (isSafe(board, row, col)) {
      board[row][col] = 1;  // Place queen
      if (solveNQueens(board, col + 1)) {
        return true;
      }
      board[row][col] = 0;  // Backtrack
    }
  }
  return false;
}

function isSafe(board, row, col) {
  for (let i = 0; i < col; i++) {
    if (board[row][i] === 1) return false; // Same row
  }

  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) return false; // Upper diagonal
  }

  for (let i = row, j = col; i < N && j >= 0; i++, j--) {
    if (board[i][j] === 1) return false; // Lower diagonal
  }

  return true;
}`}
                </code>
              </pre>
            </div>

            {/* Time Complexity */}
            <div className="text-white mb-6">
              <h3 className="text-xl font-semibold mb-2">Time Complexity:</h3>
              <p>
                The time complexity of the backtracking solution for the N-Queens problem is O(N!), as there are N possible positions for each queen and we explore all possibilities until we find a valid solution. In the worst case, the algorithm will check all possible configurations.
              </p>
            </div>
          </motion.div>
        )}

        {/* Sudoku Solver */}
        {activeSection === 'sudoku' && (
          <motion.div 
            key="sudoku"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Sudoku Solver</h2>
            <button 
              onClick={startSolvingSudoku} 
              disabled={isSudokuRunning} 
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-8 transition-colors"
            >
              {isSudokuRunning ? 'Solving...' : 'Solve Sudoku'}
            </button>
            
            <motion.div className="grid grid-cols-9 gap-1 w-full max-w-md mx-auto mb-8">
              {sudokuBoard.map((row, i) => row.map((num, j) => {
                const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                const isEvenBox = boxIndex % 2 === 0;
                
                return (
                  <motion.div 
                    key={`${i}-${j}`} 
                    className={`aspect-square rounded ${isEvenBox ? 'bg-gray-600' : 'bg-gray-700'} flex items-center justify-center`}
                    animate={{ 
                      backgroundColor: num !== 0 ? '#FBBF24' : isEvenBox ? '#4B5563' : '#374151',
                      scale: num !== 0 ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {num !== 0 && (
                      <motion.span 
                        className="text-white text-xl font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {num}
                      </motion.span>
                    )}
                  </motion.div>
                );
              }))}
            </motion.div>
            
            {/* Problem Statement, Implementation, and Time Complexity */}
            <div className="text-white mb-6">
              <h3 className="text-xl font-bold mb-4">Problem Statement</h3>
              <p>
                The Sudoku puzzle is a logic-based number-placement puzzle. The objective is to fill a 9x9 grid with digits so that each column, each row, and each of the nine 3x3 subgrids contain all of the digits from 1 to 9. In this solver, the algorithm uses a backtracking approach to explore possible solutions and backtrack when it encounters conflicts.
              </p>
            </div>
            
            <div className="text-white mb-6">
              <h3 className="text-xl font-bold mb-4">Implementation</h3>
              <p>
                The Sudoku solver uses a backtracking algorithm. It tries placing numbers from 1 to 9 in empty cells, checking whether the number can be placed safely in the current cell (i.e., it doesn't violate Sudoku rules). If a number can be placed, it proceeds to the next empty cell. If it encounters a conflict (i.e., no valid number can be placed), it backtracks and tries a different number.
              </p>
              <pre className="bg-gray-700 p-4 rounded mt-2 text-white overflow-x-auto">
                {`
const isSafe = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true;
};

const solveSudoku = async (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            setSudokuBoard([...board]);
            await sleep(500);

            if (await solveSudoku(board)) {
              return true;
            }

            board[row][col] = 0;
            setSudokuBoard([...board]);
            await sleep(500);
          }
        }

        return false;
      }
    }
  }

  return true;
};
                `}
              </pre>
            </div>

            <div className="text-white mb-6">
              <h3 className="text-xl font-bold mb-4">Time Complexity</h3>
              <p>
                The time complexity of the backtracking algorithm for solving Sudoku is O(9^(n^2)), where n is the number of rows (or columns) in the grid. In the worst case, the algorithm has to explore all possible combinations of numbers for the empty cells, leading to an exponential time complexity. However, practical performance is often much better due to early termination from constraints and heuristics.
              </p>
            </div>
          </motion.div>
        )}

        {/* Knapsack Problem */}
        {activeSection === 'knapsack' && (
          <motion.div 
            key="knapsack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Knapsack Problem</h2>
            
            {/* Solve Knapsack Button */}
            <button 
              onClick={solveKnapsack} 
              disabled={isKnapsackRunning}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-8 transition-colors"
            >
              {isKnapsackRunning ? 'Solving...' : 'Solve Knapsack'}
            </button>

            {/* Knapsack Animation */}
            {isKnapsackRunning && (
              <div className="mb-8">
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(knapsackAnimation.currentStep / knapsackAnimation.totalSteps) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white text-center">
                  Processing step {knapsackAnimation.currentStep} of {knapsackAnimation.totalSteps}
                </p>
              </div>
            )}

            {/* Knapsack Items and Solution Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-xl font-semibold text-white mb-4">Items</h3>
                <table className="w-full text-white">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Item</th>
                      <th className="text-left p-2">Value</th>
                      <th className="text-left p-2">Weight</th>
                      <th className="text-left p-2">Selected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {knapsackItems.map((item, index) => (
                      <motion.tr 
                        key={index}
                        animate={{ 
                          backgroundColor: knapsackSolution.includes(index) ? 'rgba(16, 185, 129, 0.2)' : 'transparent' 
                        }}
                        transition={{ duration: 0.5 }}
                        className="border-t border-gray-600"
                      >
                        <td className="p-2">Item {index + 1}</td>
                        <td className="p-2">{item.value}</td>
                        <td className="p-2">{item.weight}</td>
                        <td className="p-2">
                          {knapsackSolution.includes(index) && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-block w-5 h-5 bg-green-500 rounded-full"
                            />
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="text-xl font-semibold text-white mb-4">Solution</h3>
                {knapsackSolution.length > 0 ? (
                  <div>
                    <p className="text-white mb-2">Selected Items: {knapsackSolution.map(i => `Item ${i + 1}`).join(', ')}</p>
                    <p className="text-white mb-2">
                      Total Value: {knapsackSolution.reduce((sum, i) => sum + knapsackItems[i].value, 0)}
                    </p>
                    <p className="text-white">
                      Total Weight: {knapsackSolution.reduce((sum, i) => sum + knapsackItems[i].weight, 0)} / {knapsackCapacity}
                    </p>
                  </div>
                ) : (
                  <p className="text-white">Click "Solve Knapsack" to find the optimal solution.</p>
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="text-white mb-4">
              <h3 className="text-xl font-semibold mb-2">Problem Statement:</h3>
              <p>The Knapsack Problem is a classical optimization problem where you are given a set of items, each with a weight and a value, and a knapsack with a fixed capacity. The goal is to determine the most valuable combination of items that can be carried in the knapsack without exceeding its capacity.</p>
            </div>

            {/* Implementation */}
            <div className="text-white mb-4">
              <h3 className="text-xl font-semibold mb-2">Implementation:</h3>
              <p>The solution is implemented using dynamic programming to build a table of optimal solutions to subproblems. Starting from smaller capacities, we compute the maximum value for each possible weight and item combination.</p>
              <p>Implementation steps:</p>
              <ul className="list-disc ml-6">
                <li>Initialize a 2D array to store the maximum value at each weight and item combination.</li>
                <li>Iterate through each item and weight, and determine whether including the item will increase the value.</li>
                <li>Update the table with the maximum value obtained.</li>
                <li>Trace the optimal items to include in the knapsack from the table.</li>
              </ul>
              <pre className="bg-gray-700 p-4 rounded mt-2 text-white overflow-x-auto">
                {`// Knapsack Problem Algorithm
const solveKnapsack = (knapsackItems, knapsackCapacity) => {
  let dp = Array(knapsackItems.length + 1).fill(null).map(() => Array(knapsackCapacity + 1).fill(0));

  // Build the dp table
  for (let i = 1; i <= knapsackItems.length; i++) {
    for (let w = 1; w <= knapsackCapacity; w++) {
      if (knapsackItems[i - 1].weight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - knapsackItems[i - 1].weight] + knapsackItems[i - 1].value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Extract the solution
  let res = dp[knapsackItems.length][knapsackCapacity];
  let w = knapsackCapacity;
  let solution = [];

  for (let i = knapsackItems.length; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      solution.push(i - 1);
      res -= knapsackItems[i - 1].value;
      w -= knapsackItems[i - 1].weight;
    }
  }

  return solution.reverse(); // Return the selected item indices
};

// Example usage:
const knapsackItems = [
  { value: 60, weight: 10 },
  { value: 100, weight: 20 },
  { value: 120, weight: 30 }
];
const knapsackCapacity = 50;
const solution = solveKnapsack(knapsackItems, knapsackCapacity);
console.log("Selected Items:", solution);
`}
              </pre>
            </div>

            {/* Time Complexity */}
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-2">Time Complexity:</h3>
              <p>The time complexity of the dynamic programming solution for the Knapsack problem is O(n * W), where:</p>
              <ul className="list-disc ml-6">
                <li>n is the number of items.</li>
                <li>W is the capacity of the knapsack.</li>
              </ul>
              <p>This is because we build a table with dimensions n x W, and each entry requires a constant amount of time to compute.</p>
            </div>
          </motion.div>
        )}

        {/* Graph Coloring Problem */}
        {activeSection === 'graphColoring' && (
          <motion.div 
            key="graphColoring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Graph Coloring</h2>
            <button 
              onClick={startGraphColoring} 
              disabled={isGraphColoringRunning}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-8 transition-colors"
            >
              {isGraphColoringRunning ? 'Solving...' : 'Solve Graph Coloring'}
            </button>

            {/* Graph Visualization */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Graph Visualization</h3>
              <div className="relative w-64 h-64 mx-auto">
                {/* Node positions in a pentagon */}
                {[
                  { x: 32, y: 0 },   // Top
                  { x: 64, y: 24 },  // Top Right
                  { x: 52, y: 60 },  // Bottom Right
                  { x: 12, y: 60 },  // Bottom Left
                  { x: 0, y: 24 }    // Top Left
                ].map((pos, i) => (
                  <React.Fragment key={i}>
                    {/* Draw edges first */}
                    {graphNodes[i].map((connected, j) => {
                      if (connected === 1 && j > i) {
                        const targetPos = [
                          { x: 32, y: 0 },   // Top
                          { x: 64, y: 24 },  // Top Right
                          { x: 52, y: 60 },  // Bottom Right
                          { x: 12, y: 60 },  // Bottom Left
                          { x: 0, y: 24 }    // Top Left
                        ][j];
                        
                        return (
                          <svg key={`${i}-${j}`} className="absolute top-0 left-0 w-full h-full">
                            <line 
                              x1={pos.x} 
                              y1={pos.y} 
                              x2={targetPos.x} 
                              y2={targetPos.y} 
                              stroke="white" 
                              strokeWidth="2"
                            />
                          </svg>
                        );
                      }
                      return null;
                    })}
                    
                    {/* Draw nodes */}
                    <motion.div 
                      className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ 
                        left: `${pos.x * 3}px`, 
                        top: `${pos.y * 3}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{ 
                        backgroundColor: graphColors[i] === 0 ? '#EF4444' : 
                                        graphColors[i] === 1 ? '#10B981' : 
                                        graphColors[i] === 2 ? '#3B82F6' : 
                                        '#6B7280'
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {i + 1}
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="text-white mb-4">
              <h3 className="font-semibold text-lg mb-2">Problem Statement:</h3>
              <p>
                The Graph Coloring problem involves assigning colors to the vertices of a graph such that no two adjacent vertices
                have the same color. The objective is to minimize the number of colors used. This problem is useful in various real-life
                scenarios like scheduling tasks, map coloring, and frequency assignment.
              </p>
            </div>

            {/* Implementation */}
            <div className="text-white mb-4">
              <h3 className="font-semibold text-lg mb-2">Implementation:</h3>
              <p>
                The problem is solved using backtracking. We attempt to color each node of the graph, and for each node, we try out all
                possible colors while ensuring that no two adjacent nodes share the same color. If a valid coloring is found, we move on to the next
                node; otherwise, we backtrack and try a different color.
              </p>
              <pre className="bg-gray-700 p-4 rounded mt-2 text-white overflow-x-auto">
                <code>
                  {`// Graph Coloring Algorithm using Backtracking

function isGraphColoringSafe(graph, node, color, colors) {
  for (let i = 0; i < graph.length; i++) {
    if (graph[node][i] === 1 && colors[i] === color) {
      return false;
    }
  }
  return true;
}

function solveGraphColoring(graph, node, colors, m) {
  if (node === graph.length) {
    return true; // All nodes are colored
  }

  for (let color = 0; color < m; color++) {
    if (isGraphColoringSafe(graph, node, color, colors)) {
      colors[node] = color; // Assign color to the node

      if (solveGraphColoring(graph, node + 1, colors, m)) {
        return true;
      }

      colors[node] = -1; // Backtrack if no solution found
    }
  }
  
  return false; // No color is valid, backtrack
}

// Example usage
const graph = [
  [0, 1, 0, 1, 0],
  [1, 0, 1, 1, 0],
  [0, 1, 0, 1, 1],
  [1, 1, 1, 0, 1],
  [0, 0, 1, 1, 0]
];

const m = 3; // Number of colors
const colors = Array(graph.length).fill(-1); // Initialize all nodes with no color

if (solveGraphColoring(graph, 0, colors, m)) {
  console.log("Solution found:", colors);
} else {
  console.log("No solution exists");
}
`}
                </code>
              </pre>
            </div>

            {/* Time Complexity */}
            <div className="text-white mb-4">
              <h3 className="font-semibold text-lg mb-2">Time Complexity:</h3>
              <p>
                The time complexity of the graph coloring problem using backtracking is O(C^V), where C is the number of colors available
                and V is the number of vertices in the graph. This is because, in the worst case, for each vertex, we try all C colors, 
                and this process is repeated for all V vertices.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Backtracking;