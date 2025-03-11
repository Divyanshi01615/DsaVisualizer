import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, RotateCcw, Settings, Info } from 'lucide-react';
import './styles/algorithm-race.css';

// Algorithm categories and implementations
const algorithmCategories = {
  sorting: [
    { name: 'Bubble Sort', complexity: 'O(n²)', category: 'sorting', color: '#FF6B6B' },
    { name: 'Selection Sort', complexity: 'O(n²)', category: 'sorting', color: '#4ECDC4' },
    { name: 'Insertion Sort', complexity: 'O(n²)', category: 'sorting', color: '#45B7D1' },
    { name: 'Merge Sort', complexity: 'O(n log n)', category: 'sorting', color: '#96CEB4' },
    { name: 'Quick Sort', complexity: 'O(n log n)', category: 'sorting', color: '#FFEEAD' }
  ],
  searching: [
    { name: 'Linear Search', complexity: 'O(n)', category: 'searching' },
    { name: 'Binary Search', complexity: 'O(log n)', category: 'searching' }
  ],
  graph: [
    { name: 'BFS', complexity: 'O(V + E)', category: 'graph' },
    { name: 'DFS', complexity: 'O(V + E)', category: 'graph' },
    { name: "Dijkstra's", complexity: 'O((V + E) log V)', category: 'graph' },
    { name: "Prim's", complexity: 'O(E log V)', category: 'graph' },
    { name: "Kruskal's", complexity: 'O(E log V)', category: 'graph' }
  ],
  dp: [
    { name: 'Fibonacci', complexity: 'O(n)', category: 'dp' },
    { name: 'Knapsack', complexity: 'O(nW)', category: 'dp' },
    { name: 'LCS', complexity: 'O(mn)', category: 'dp' },
    { name: 'LIS', complexity: 'O(n²)', category: 'dp' }
  ],
  greedy: [
    { name: 'Activity Selection', complexity: 'O(n log n)', category: 'greedy' },
    { name: 'Huffman Coding', complexity: 'O(n log n)', category: 'greedy' }
  ],
  backtracking: [
    { name: 'N-Queens', complexity: 'O(n!)', category: 'backtracking' },
    { name: 'Sudoku Solver', complexity: 'O(9^(n*n))', category: 'backtracking' }
  ],
  tree: [
    { name: 'Tree Traversals', complexity: 'O(n)', category: 'tree' },
    { name: 'BST Operations', complexity: 'O(h)', category: 'tree' },
    { name: 'AVL Rotations', complexity: 'O(log n)', category: 'tree' },
    { name: 'LCA', complexity: 'O(h)', category: 'tree' }
  ],
  mathematical: [
    { name: 'GCD (Euclidean)', complexity: 'O(log min(a,b))', category: 'mathematical' },
    { name: 'Sieve of Eratosthenes', complexity: 'O(n log log n)', category: 'mathematical' },
    { name: 'Prime Factorization', complexity: 'O(√n)', category: 'mathematical' }
  ]
};

// Algorithm implementations
const algorithms = {
  'Bubble Sort': {
    run: (arr: number[]) => {
      const steps: number[][] = [];
      const n = arr.length;
      const array = [...arr];
      
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (array[j] > array[j + 1]) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            steps.push([...array]);
          }
        }
      }
      
      return steps;
    }
  },
  'Selection Sort': {
    run: (arr: number[]) => {
      const steps: number[][] = [];
      const n = arr.length;
      const array = [...arr];
      
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (array[j] < array[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          [array[i], array[minIdx]] = [array[minIdx], array[i]];
          steps.push([...array]);
        }
      }
      
      return steps;
    }
  },
  'Insertion Sort': {
    run: (arr: number[]) => {
      const steps: number[][] = [];
      const array = [...arr];
      
      for (let i = 1; i < array.length; i++) {
        const key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
          array[j + 1] = array[j];
          j--;
          steps.push([...array]);
        }
        array[j + 1] = key;
        steps.push([...array]);
      }
      
      return steps;
    }
  },
  'Merge Sort': {
    run: (arr: number[]) => {
      const steps: number[][] = [];
      const array = [...arr];
      
      const merge = (left: number[], right: number[]): number[] => {
        const result: number[] = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) {
            result.push(left[i++]);
          } else {
            result.push(right[j++]);
          }
        }
        
        return [...result, ...left.slice(i), ...right.slice(j)];
      };
      
      const mergeSort = (arr: number[]): number[] => {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));
        const merged = merge(left, right);
        steps.push(merged);
        return merged;
      };
      
      mergeSort(array);
      return steps;
    }
  },
  'Quick Sort': {
    run: (arr: number[]) => {
      const steps: number[][] = [];
      const array = [...arr];
      
      const partition = (low: number, high: number): number => {
        const pivot = array[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
          if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            steps.push([...array]);
          }
        }
        
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        steps.push([...array]);
        return i + 1;
      };
      
      const quickSort = (low: number, high: number) => {
        if (low < high) {
          const pi = partition(low, high);
          quickSort(low, pi - 1);
          quickSort(pi + 1, high);
        }
      };
      
      quickSort(0, array.length - 1);
      return steps;
    }
  }
};

const AlgorithmRace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof algorithmCategories>('sorting');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [customInput, setCustomInput] = useState<string>('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [results, setResults] = useState<Array<{
    name: string;
    time: number;
    comparisons: number;
    swaps: number;
  }>>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [arrays, setArrays] = useState<{ [key: string]: number[][] }>({});
  const [currentStepIndex, setCurrentStepIndex] = useState<{ [key: string]: number }>({});

  const generateRandomArray = () => {
    if (useCustomInput && customInput.trim()) {
      const numbers = customInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      return numbers.length > 0 ? numbers : Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
    }
    return Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
  };

  const toggleAlgorithm = (name: string) => {
    setSelectedAlgorithms(prev =>
      prev.includes(name)
        ? prev.filter(a => a !== name)
        : [...prev, name]
    );
  };

  const drawArrays = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padding = 20;
    const availableHeight = canvas.height - 2 * padding;
    const sectionHeight = availableHeight / selectedAlgorithms.length;

    selectedAlgorithms.forEach((algoName, algoIndex) => {
      const steps = arrays[algoName];
      const currentStep = steps?.[currentStepIndex[algoName] || 0];
      
      if (!currentStep) return;

      const sectionY = padding + algoIndex * sectionHeight;
      const barWidth = (canvas.width - 2 * padding) / currentStep.length;
      const maxValue = Math.max(...currentStep);

      // Draw algorithm name
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText(algoName, padding, sectionY - 5);

      // Find algorithm color
      const algoColor = algorithmCategories.sorting.find(a => a.name === algoName)?.color || '#3b82f6';

      // Draw bars with gradient
      currentStep.forEach((value, index) => {
        const barHeight = (value / maxValue) * (sectionHeight - 40);
        const x = padding + index * barWidth;
        const y = sectionY + sectionHeight - barHeight - 10;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, algoColor);
        gradient.addColorStop(1, '#1a1a1a');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        
        // Add bar border for better visibility
        ctx.strokeStyle = '#2a2a2a';
        ctx.strokeRect(x, y, barWidth - 1, barHeight);
      });
    });
  };

  const startRace = async () => {
    if (selectedAlgorithms.length === 0) return;
    
    setIsRunning(true);
    setResults([]);
    
    const initialArray = generateRandomArray();
    const newArrays: { [key: string]: number[][] } = {};
    const newResults: typeof results = [];
    
    // Generate all steps for each algorithm
    selectedAlgorithms.forEach(algoName => {
      const startTime = performance.now();
      const steps = algorithms[algoName as keyof typeof algorithms]?.run([...initialArray]) || [];
      const endTime = performance.now();
      
      newArrays[algoName] = [initialArray, ...steps];
      newResults.push({
        name: algoName,
        time: endTime - startTime,
        comparisons: steps.length,
        swaps: steps.length
      });
    });

    setArrays(newArrays);
    setCurrentStepIndex(Object.fromEntries(selectedAlgorithms.map(algo => [algo, 0])));
    setResults(newResults);

    // Animation loop
    let frame = 0;
    const maxSteps = Math.max(...Object.values(newArrays).map(steps => steps.length));
    const animate = () => {
      if (frame < maxSteps) {
        setCurrentStepIndex(prev => {
          const newIndices = { ...prev };
          selectedAlgorithms.forEach(algo => {
            if (frame < (newArrays[algo]?.length || 0)) {
              newIndices[algo] = frame;
            }
          });
          return newIndices;
        });
        frame++;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const resetRace = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setSelectedAlgorithms([]);
    setResults([]);
    setArrays({});
    setCurrentStepIndex({});
    setIsRunning(false);
  };

  useEffect(() => {
    drawArrays();
  }, [arrays, currentStepIndex]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="algorithm-container">
      <header className="algorithm-header">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Algorithm Race</h1>
          <p className="text-xl opacity-90">
            Compare and visualize different algorithms in real-time
          </p>
        </div>
      </header>

      <main className="algorithm-content">
        {/* Category Selection */}
        <div className="algorithm-tabs">
          {Object.keys(algorithmCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as keyof typeof algorithmCategories)}
              className={`algorithm-tab ${
                activeCategory === category ? 'algorithm-tab-active' : 'algorithm-tab-inactive'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Algorithm Selection Panel */}
          <div className="algorithm-card">
            <h2 className="text-2xl font-bold mb-4">Select Algorithms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {algorithmCategories[activeCategory].map(algorithm => (
                <div
                  key={algorithm.name}
                  onClick={() => toggleAlgorithm(algorithm.name)}
                  className={`p-4 border rounded-md cursor-pointer ${
                    selectedAlgorithms.includes(algorithm.name)
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{algorithm.name}</span>
                    <span className="text-sm text-gray-400">
                      {algorithm.complexity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Panel */}
          <div className="algorithm-card">
            <h2 className="text-2xl font-bold mb-4">Configuration</h2>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="useCustomInput"
                  checked={useCustomInput}
                  onChange={(e) => setUseCustomInput(e.target.checked)}
                  className="mr-2"
                  disabled={isRunning}
                />
                <label htmlFor="useCustomInput" className="text-sm font-medium">
                  Use Custom Input
                </label>
              </div>
              
              {useCustomInput ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Enter numbers (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
                    disabled={isRunning}
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Array Size: {arraySize}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={arraySize}
                    onChange={(e) => setArraySize(parseInt(e.target.value))}
                    className="w-full"
                    disabled={isRunning}
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Animation Speed: {speed}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={startRace}
                disabled={isRunning || selectedAlgorithms.length === 0}
                className={`control-button ${
                  isRunning || selectedAlgorithms.length === 0
                    ? 'control-button-disabled'
                    : 'control-button-primary'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Race
                  </>
                )}
              </button>

              <button
                onClick={resetRace}
                className="control-button control-button-secondary"
                disabled={isRunning}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="visualization-container mt-8">
          <canvas
            ref={canvasRef}
            className="w-full h-[600px] bg-gray-900 rounded-lg"
            style={{ minHeight: '600px' }}
          />
        </div>

        {/* Results Panel */}
        {results.length > 0 && (
          <div className="algorithm-card mt-8">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={result.name}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">#{index + 1}</span>
                    <div>
                      <h3 className="font-medium">{result.name}</h3>
                      <p className="text-sm text-gray-300">
                        Comparisons: {result.comparisons} | Swaps: {result.swaps}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xl">
                    {result.time.toFixed(2)}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlgorithmRace;
