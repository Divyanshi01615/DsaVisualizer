import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BarProps {
  value: number;
  height: number;
  isActive: boolean;
  isSorted: boolean;
}

const Bar = ({ value, height, isActive, isSorted }: BarProps) => (
  <motion.div
    initial={{ height: 0 }}
    animate={{ height }}
    className={`w-8 rounded-t ${isActive ? 'bg-yellow-500' : isSorted ? 'bg-green-500' : 'bg-blue-500'}`}
    style={{ height: `${height}px` }}
  >
    <span className="text-xs text-white">{value}</span>
  </motion.div>
);

const Sorting = () => {
  const [array, setArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<string>('');

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 50) + 1
    );
    setArray(newArray);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    setAlgorithm('Bubble Sort');
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await sleep(500);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
    }

    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  };

  const selectionSort = async () => {
    setAlgorithm('Selection Sort');
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        setActiveIndices([minIdx, j]);
        await sleep(500);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      setSortedIndices((prev) => [...prev, i]);
    }

    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  };

  const quickSort = async () => {
    setAlgorithm('Quick Sort');
    setIsSorting(true);
    const arr = [...array];

    const partition = async (low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setActiveIndices([j, high]);
        await sleep(500);

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);

      return i + 1;
    };

    const sort = async (low: number, high: number) => {
      if (low < high) {
        const pivotIndex = await partition(low, high);
        await sort(low, pivotIndex - 1);
        await sort(pivotIndex + 1, high);
      }
    };

    await sort(0, arr.length - 1);

    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  };

  const mergeSort = async () => {
    setAlgorithm('Merge Sort');
    setIsSorting(true);
    const arr = [...array];

    const merge = async (left: number[], right: number[]) => {
      let result: number[] = [];
      let i = 0;
      let j = 0;

      while (i < left.length && j < right.length) {
        setActiveIndices([i, j]);
        await sleep(500);

        if (left[i] < right[j]) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      }

      return result.concat(left.slice(i), right.slice(j));
    };

    const sort = async (arr: number[]) => {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);

      const sortedLeft = await sort(left);
      const sortedRight = await sort(right);

      return merge(sortedLeft, sortedRight);
    };

    const sortedArray = await sort(arr);
    setArray(sortedArray);
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  };

  const renderTimeComplexity = () => {
    switch (algorithm) {
      case 'Bubble Sort':
        return (
          <ul className="space-y-2 text-gray-300">
            <li>• Best Case: O(n)</li>
            <li>• Average Case: O(n²)</li>
            <li>• Worst Case: O(n²)</li>
            <li>• Space Complexity: O(1)</li>
          </ul>
        );
      case 'Selection Sort':
        return (
          <ul className="space-y-2 text-gray-300">
            <li>• Best Case: O(n²)</li>
            <li>• Average Case: O(n²)</li>
            <li>• Worst Case: O(n²)</li>
            <li>• Space Complexity: O(1)</li>
          </ul>
        );
      case 'Quick Sort':
        return (
          <ul className="space-y-2 text-gray-300">
            <li>• Best Case: O(n log n)</li>
            <li>• Average Case: O(n log n)</li>
            <li>• Worst Case: O(n²)</li>
            <li>• Space Complexity: O(log n)</li>
          </ul>
        );
      case 'Merge Sort':
        return (
          <ul className="space-y-2 text-gray-300">
            <li>• Best Case: O(n log n)</li>
            <li>• Average Case: O(n log n)</li>
            <li>• Worst Case: O(n log n)</li>
            <li>• Space Complexity: O(n)</li>
          </ul>
        );
      default:
        return null;
    }
  };

  const renderAlgorithmCode = () => {
    switch (algorithm) {
      case 'Bubble Sort':
        return (
          <pre className="bg-gray-700 p-4 rounded text-gray-300">
            {`function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`}
          </pre>
        );
      case 'Selection Sort':
        return (
          <pre className="bg-gray-700 p-4 rounded text-gray-300">
            {`function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  
  return arr;
}`}
          </pre>
        );
      case 'Quick Sort':
        return (
          <pre className="bg-gray-700 p-4 rounded text-gray-300">
            {`function quickSort(arr) {
  const partition = (low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  };

  const sort = (low, high) => {
    if (low < high) {
      const pivotIndex = partition(low, high);
      sort(low, pivotIndex - 1);
      sort(pivotIndex + 1, high);
    }
  };

  sort(0, arr.length - 1);
  return arr;
}`}
          </pre>
        );
      case 'Merge Sort':
        return (
          <pre className="bg-gray-700 p-4 rounded text-gray-300">
            {`function mergeSort(arr) {
  const merge = (left, right) => {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(left.slice(i), right.slice(j));
  };

  const sort = (arr) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(sort(left), sort(right));
  };

  return sort(arr);
}`}
          </pre>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Sorting Algorithms</h1>
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Sorting Algorithms</h2>
        <p className="text-white">
          A sorting algorithm is a method for reorganizing a large number of items into a specific order, such as alphabetical, highest-to-lowest value, or shortest-to-longest distance. Sorting algorithms take lists of items as input data, perform specific operations on those lists, and deliver ordered arrays as output.
        </p>
        </div>
        <div className='bg-gray-800 rounded-lg p-6 mb-8'>
        <h3 className="text-xl font-semibold text-white mt-4">Characteristics of Sorting Algorithms</h3><br />
        <ul className="list-disc ml-5 text-white">
          <li><strong>Speed (Time Complexity):</strong> The efficiency of a sorting method is determined by its speed, which varies based on the number of elements.</li>
          <li><strong>Space Complexity:</strong> Sorting algorithms require additional memory for auxiliary variables, loop counters, and temporary arrays.</li>
          <li><strong>Stability:</strong> Stable sorting methods maintain the relative sequence of elements with the same sort key.</li>
          <li><strong>Comparison vs. Non-Comparison Sorts:</strong> Some sorting methods compare elements, while others (e.g., Counting Sort, Radix Sort) use alternative techniques.</li>
          <li><strong>Recursive vs. Non-Recursive:</strong> Recursive sorting algorithms use stack memory, which can lead to stack overflow if the recursion depth is too large.</li>
        </ul>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex justify-between mb-8">
          <button
            onClick={generateArray}
            disabled={isSorting}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-4"
          >
            Generate New Array
          </button>
          <button
            onClick={bubbleSort}
            disabled={isSorting}
            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mr-4"
          >
            Bubble Sort
          </button>
          <button
            onClick={selectionSort}
            disabled={isSorting}
            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mr-4"
          >
            Selection Sort
          </button>
          <button
            onClick={quickSort}
            disabled={isSorting}
            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mr-4"
          >
            Quick Sort
          </button>
          <button
            onClick={mergeSort}
            disabled={isSorting}
            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Merge Sort
          </button>
        </div>

        <div className="flex items-end justify-center gap-2 h-64 mb-8">
          {array.map((value, index) => (
            <Bar
              key={index}
              value={value}
              height={value * 4}
              isActive={activeIndices.includes(index)}
              isSorted={sortedIndices.includes(index)}
            />
          ))}
        </div>

        <div className="bg-gray-700 rounded p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Time Complexity</h2>
          {renderTimeComplexity()}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Algorithm Code</h2>
        {renderAlgorithmCode()}
      </div>
    </div>
  );
};

export default Sorting;
