import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

// Simplified algorithm categories focusing on sorting and searching
const algorithmCategories = {
  sorting: [
    { name: 'Bubble Sort', complexity: 'O(n²)', color: '#3b82f6' },
    { name: 'Selection Sort', complexity: 'O(n²)', color: '#3b82f6' },
    { name: 'Insertion Sort', complexity: 'O(n²)', color: '#3b82f6' },
    { name: 'Merge Sort', complexity: 'O(n log n)', color: '#3b82f6' },
    { name: 'Quick Sort', complexity: 'O(n log n)', color: '#3b82f6' }
  ],
  searching: [
    { name: 'Linear Search', complexity: 'O(n)', color: '#ef4444' },
    { name: 'Binary Search', complexity: 'O(log n)', color: '#ef4444' }
  ]
};

// Algorithm implementations remain the same
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
  },
  'Linear Search': {
    run: (arr: number[]) => {
      const steps: number[][] = [];
      const array = [...arr];
      const target = Math.floor(Math.random() * Math.max(...array));
      
      for (let i = 0; i < array.length; i++) {
        steps.push([...array]);
        if (array[i] === target) break;
      }
      
      return steps;
    }
  },
  'Binary Search': {
    run: (arr: number[]) => {
      const steps: number[][] = [];
      const array = [...arr].sort((a, b) => a - b);
      const target = Math.floor(Math.random() * Math.max(...array));
      
      let left = 0;
      let right = array.length - 1;
      
      while (left <= right) {
        steps.push([...array]);
        const mid = Math.floor((left + right) / 2);
        
        if (array[mid] === target) break;
        if (array[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      
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
  }>>([]);
  const [initialArray, setInitialArray] = useState<number[]>([]);

  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
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

  const drawArray = (algoName: string) => {
    const canvas = canvasRefs.current[algoName];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padding = 20;
    const steps = arrays[algoName];
    const currentStep = steps?.[currentStepIndex[algoName] || 0];
    
    if (!currentStep) return;

    // Draw initial array if it's the first step
    if (currentStepIndex[algoName] === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText('Initial Array: ' + initialArray.join(', '), padding, 20);
    }

    const barWidth = Math.min(16, (canvas.width - 2 * padding) / currentStep.length);
    const maxValue = Math.max(...currentStep);
    const availableHeight = canvas.height - 60; // Account for initial array text

    // Draw algorithm name and current step
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.fillText(`${algoName} - Step ${currentStepIndex[algoName]}`, padding, 40);

    // Find algorithm color based on category
    const category = Object.entries(algorithmCategories).find(([_, algos]) => 
      algos.some(algo => algo.name === algoName)
    )?.[0];
    const color = category === 'sorting' ? '#3b82f6' : '#ef4444';

    // Draw bars
    currentStep.forEach((value, index) => {
      const barHeight = (value / maxValue) * (availableHeight - 40);
      const x = padding + index * (barWidth + 2);
      const y = canvas.height - barHeight - padding;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  };

  const startRace = async () => {
    if (selectedAlgorithms.length === 0) return;
    
    setIsRunning(true);
    setResults([]);
    
    const newInitialArray = generateRandomArray();
    setInitialArray(newInitialArray);
    
    const newArrays: { [key: string]: number[][] } = {};
    const newResults: typeof results = [];
    
    selectedAlgorithms.forEach(algoName => {
      const startTime = performance.now();
      const steps = algorithms[algoName as keyof typeof algorithms]?.run([...newInitialArray]) || [];
      const endTime = performance.now();
      
      newArrays[algoName] = [newInitialArray, ...steps];
      newResults.push({
        name: algoName,
        time: endTime - startTime,
        comparisons: steps.length
      });
    });

    setArrays(newArrays);
    setCurrentStepIndex(Object.fromEntries(selectedAlgorithms.map(algo => [algo, 0])));
    setResults(newResults);

    let frame = 0;
    const maxSteps = Math.max(...Object.values(newArrays).map(steps => steps.length));
    const frameDelay = Math.max(1, Math.floor(100 - speed));
    
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
        animationRef.current = setTimeout(() => requestAnimationFrame(animate), frameDelay) as unknown as number;
      } else {
        setIsRunning(false);
      }
    };

    animationRef.current = setTimeout(() => requestAnimationFrame(animate), frameDelay) as unknown as number;
  };

  const resetRace = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setSelectedAlgorithms([]);
    setResults([]);
    setArrays({});
    setCurrentStepIndex({});
    setIsRunning(false);
    setInitialArray([]);
  };

  useEffect(() => {
    selectedAlgorithms.forEach(algoName => {
      drawArray(algoName);
    });
  }, [arrays, currentStepIndex]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Algorithm Race</h1>
        <p className="text-xl opacity-90">
          Compare sorting and searching algorithms in real-time
        </p>
      </header>

      <main className="space-y-8">
        {/* Category Selection */}
        <div className="flex gap-4">
          {Object.keys(algorithmCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as keyof typeof algorithmCategories)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Algorithm Selection */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Select Algorithms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {algorithmCategories[activeCategory].map(algorithm => (
                <div
                  key={algorithm.name}
                  onClick={() => toggleAlgorithm(algorithm.name)}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
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

          {/* Controls */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Configuration</h2>
            
            <div className="space-y-6">
              <div>
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
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Enter numbers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                      className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
                      disabled={isRunning}
                    />
                  </div>
                ) : (
                  <div>
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

              <div>
                <label className="block text-sm font-medium mb-1">
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
                  className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                    isRunning || selectedAlgorithms.length === 0
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
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
                  className="flex items-center px-4 py-2 rounded-md font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
                  disabled={isRunning}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Algorithm Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedAlgorithms.map(algoName => (
            <div key={algoName} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{algoName}</h3>
              <canvas
                ref={el => canvasRefs.current[algoName] = el}
                className="w-full h-[300px] bg-gray-900 rounded-lg"
                style={{ minHeight: '300px' }}
              />
            </div>
          ))}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg">
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
                        Comparisons: {result.comparisons}
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