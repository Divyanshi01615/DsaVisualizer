import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: number;
  isActive: boolean;
  isFound: boolean;
}

const SearchBar = ({ value, isActive, isFound }: SearchBarProps) => (
  <motion.div
    className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${
      isFound ? 'bg-green-500' : isActive ? 'bg-yellow-500' : 'bg-blue-500'
    }`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {value}
  </motion.div>
);

const Searching = () => {
  const generateNewArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) * 2 + 1);
    setArray(newArray);
    setSearchValue('');
    setActiveIndex(null);
    setFoundIndex(null);
    setIsSearching(false);
    setNotFoundMessage('');
    setCodeToShow('');
    setTimeComplexity('');
  };

  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15]);
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [codeToShow, setCodeToShow] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const linearSearch = async () => {
    const target = parseInt(searchValue);
    setIsSearching(true);
    setFoundIndex(null);
    setNotFoundMessage('');
    setCodeToShow(`function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`);
    setTimeComplexity('• Best Case: O(1)\n• Average Case: O(n)\n• Worst Case: O(n)');

    for (let i = 0; i < array.length; i++) {
      setActiveIndex(i);
      await sleep(500);

      if (array[i] === target) {
        setFoundIndex(i);
        setIsSearching(false);
        return;
      }
    }

    setActiveIndex(null);
    setIsSearching(false);
    setNotFoundMessage('Element not found 😞');
  };

  const binarySearch = async () => {
    const target = parseInt(searchValue);
    setIsSearching(true);
    setFoundIndex(null);
    setNotFoundMessage('');
    setCodeToShow(`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`);
    setTimeComplexity('• Best Case: O(1)\n• Average Case: O(log n)\n• Worst Case: O(log n)');

    let left = 0;
    let right = array.length - 1;

    // Sorting the array before performing binary search
    const sortedArray = [...array].sort((a, b) => a - b); // Sort the array in ascending order
    setArray(sortedArray); // Update the state with the sorted array

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setActiveIndex(mid);
      await sleep(500);

      if (sortedArray[mid] === target) {
        setFoundIndex(mid);
        setIsSearching(false);
        return;
      }

      if (sortedArray[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setActiveIndex(null);
    setIsSearching(false);
    setNotFoundMessage('Element not found 😞');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Searching Algorithms</h1>
      <div className="mt-8 bg-gray-800 p-6 rounded">
        <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
        <p className="text-white">
          Searching algorithms are used to find one or more elements from a dataset. These algorithms help locate elements in specific data structures.
        </p>
        <p className="text-white">
          Searching may be sequential or non-sequential. If the dataset is unordered, sequential searching is required. Otherwise, optimized techniques can be used to reduce complexity.
        </p>
      </div>
       <br /><br />
      <div className="mt-8 bg-gray-800 p-6 rounded">
        <h2 className="text-2xl font-semibold text-white mb-4">Types of Search Algorithms</h2>
        <ul className="list-disc ml-5 text-white">
          <li>
            <strong>Sequential Search:</strong> The list or array is traversed sequentially, checking every element. Example: Linear Search.
          </li>
          <li>
            <strong>Interval Search:</strong> Designed for sorted data structures, these algorithms are more efficient than linear search. Example: Binary Search.
          </li>
        </ul>
      </div><br /><br />
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex gap-4 mb-8">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-700 text-white"
            placeholder="Enter number to search"
          />
          <button
            onClick={linearSearch}
            disabled={isSearching || !searchValue}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Linear Search
          </button>
          <button
            onClick={binarySearch}
            disabled={isSearching || !searchValue}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Binary Search
          </button>
          <button
            onClick={generateNewArray}
            className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Generate New Array
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {array.map((value, index) => (
            <SearchBar
              key={index}
              value={value}
              isActive={index === activeIndex}
              isFound={index === foundIndex}
            />
          ))}
        </div>

        {notFoundMessage && (
          <div className="bg-red-500 text-white p-4 rounded mb-8">
            {notFoundMessage}
          </div>
        )}

        <div className="bg-gray-700 rounded p-4 mb-4">
          <h2 className="text-xl font-semibold text-white mb-4">Time Complexity</h2>
          <pre className="space-y-2 text-gray-300">
            {timeComplexity && timeComplexity}
          </pre>
        </div>

        {codeToShow && (
          <div className="bg-gray-700 rounded p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Algorithm Implementation</h2>
            <pre className="space-y-2 text-gray-300">
              {codeToShow}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searching;
