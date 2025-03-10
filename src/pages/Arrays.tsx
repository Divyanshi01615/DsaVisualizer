import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Arrays = () => {
  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 5]);
  const [newValue, setNewValue] = useState('');

  const addElement = () => {
    if (newValue && !isNaN(Number(newValue))) {
      const updatedArray = [...array, Number(newValue)];
      setArray(updatedArray);
      setNewValue('');
    }
  };

  const removeElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Array Operations</h1>

      {/* Input to add new element */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-700"
            placeholder="Enter a number"
          />
          <button
            onClick={addElement}
            className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Add Element
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          {array.map((num, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                {num}
              </div>
              <div className="absolute top-1 left-1 text-xs text-white bg-gray-700 rounded-full px-2">
                Index: {index}
              </div>
              <button
                onClick={() => removeElement(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-sm flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-700 rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Time Complexity</h2>
          <ul className="space-y-2">
            <li>• Access: O(1)</li>
            <li>• Search: O(n)</li>
            <li>• Insertion: O(n)</li>
            <li>• Deletion: O(n)</li>
          </ul>
        </div>
      </div>

      {/* New sections */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Definition</h2>
        <div>
          <p>Array is a linear data structure that collects elements of the same data type and stores them in contiguous memory locations. Array works on an indexing system starting from 0 to (n-1) where n is the size of the array.</p>
        </div>
      </div>

      {/* 1D Array Definition and Example */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">1D-Array</h2>
        <div>
          <p>1D arrays are used to store a single row of elements in linear fashion. They are useful in representing simple lists, sequences, or collections.</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Example of 1D Array</h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gray-700 p-4 rounded mb-4"
          >
            <pre>
              {`// 1D Array Declaration
const arr = [1, 2, 3, 4, 5];`}
            </pre>
          </motion.div>
          <h4 className="mt-4">Indexing:</h4>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gray-700 p-4 rounded mb-4"
          >
            <pre>
              {`// Indexing in 1D Array
arr[0]; // 1
arr[1]; // 2
arr[2]; // 3`}
            </pre>
          </motion.div>
        </div>
      </div>

      {/* 2D Array Definition and Example */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">2D-Array</h2>
        <div>
          <p>2D arrays represent tabular data. They are used to store values in rows and columns, such as matrices or grids.</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Example of 2D Array</h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gray-700 p-4 rounded mb-4"
          >
            <pre>
              {`// 2D Array Declaration
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];`}
            </pre>
          </motion.div>
          <h4 className="mt-4">Indexing:</h4>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gray-700 p-4 rounded mb-4"
          >
            <pre>
              {`// Indexing in 2D Array
matrix[0][0]; // 1
matrix[1][2]; // 6`}
            </pre>
          </motion.div>
          <h4 className="mt-4">Matrix Representation:</h4>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gray-700 p-4 rounded mb-4"
          >
            <pre>
              {`Matrix:
1  2  3
4  5  6
7  8  9`}
            </pre>
          </motion.div>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Advantages</h2>
        <div>
          <ul className="space-y-2">
            <li>• Arrays store multiple elements of the same type with the same name.</li>
            <li>• You can randomly access elements in the array using an index number.</li>
            <li>• Array memory is predefined, so there is no extra memory loss.</li>
            <li>• Arrays avoid memory overflow.</li>
            <li>• 2D arrays can efficiently represent tabular data.</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Disadvantages</h2>
        <div>
          <ul className="space-y-2">
            <li>• The number of elements in the array should be predefined.</li>
            <li>• An array is static; it cannot alter its size after declaration.</li>
            <li>• Insertion and deletion operations in the array are quite tricky as the array stores elements in continuous form.</li>
            <li>• Allocating excess memory than required may lead to memory wastage.</li>
          </ul>
        </div>
      </div>

      {/* Algorithms and Applications */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Algorithms</h2>
        <div>
          <ul className="space-y-2">
            <li>• Kadane's Algorithm</li>
            <li>• Floyd's Cycle Detection</li>
            <li>• KMP Algorithm</li>
            <li>• Quick Select</li>
            <li>• Boyer-Moore Majority Vote Algorithm</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Applications</h2>
        <div>
          <p>Arrays in data structures help to solve some high-level problems like the Longest Consecutive Subsequence program or some easy tasks like arranging the same things in ascending order.</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Common Array Operations</h2>
        <div className="space-y-4">
          <pre className="bg-gray-700 p-4 rounded">
            {`// Array Declaration
const arr = [1, 2, 3, 4, 5];

// Adding element to end
arr.push(6);

// Removing element from end
arr.pop();

// Adding element to beginning
arr.unshift(0);

// Removing element from beginning
arr.shift();

// Accessing element
const element = arr[2];

// Finding element index
const index = arr.indexOf(3);`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Arrays;
