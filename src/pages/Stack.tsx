import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GitBranch, Code2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const Stack = () => {
  const [stack, setStack] = useState<number[]>([]);
  const [newValue, setNewValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [peekValue, setPeekValue] = useState<number | null>(null);
  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const maxSize = 10;

  // Time Complexity: O(1)
  const pushElement = () => {
    const num = Number(newValue);
    if (newValue && !isNaN(num)) {
      if (stack.length < maxSize) {
        setStack((prevStack) => [num, ...prevStack]);
        setNewValue("");
        setActiveButton("push");
        setTimeout(() => setActiveButton(null), 200);
      } else {
        alert("Stack Overflow: Cannot add more elements.");
      }
    }
  };

  // Time Complexity: O(1)
  const popElement = () => {
    if (stack.length > 0) {
      setStack((prevStack) => prevStack.slice(1));
      setActiveButton("pop");
      setTimeout(() => setActiveButton(null), 200);
    }
  };

  // Time Complexity: O(1)
  const peekElement = () => {
    setPeekValue(stack.length > 0 ? stack[0] : null);
    setActiveButton("peek");
    setTimeout(() => setActiveButton(null), 200);
  };

  // Time Complexity: O(n)
  const searchElement = () => {
    const num = Number(searchValue);
    const index = stack.indexOf(num);
    setSearchIndex(index >= 0 ? index : null);
    setActiveButton("search");
    setTimeout(() => setActiveButton(null), 200);
  };

  // Time Complexity: O(1)
  const clearStack = () => {
    setStack([]);
    setPeekValue(null);
    setSearchIndex(null);
    setActiveButton("clear");
    setTimeout(() => setActiveButton(null), 200);
  };

  return (
    <div className="max-w-6xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Stack Data Structure</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="mb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <GitBranch className="text-blue-400" /> Properties
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Follows LIFO (Last In First Out) principle</li>
                <li>All operations occur at one end (top)</li>
                <li>Implemented via Array or Linked List</li>
                <li>Has fixed size in array implementation</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Code2 className="text-green-400" /> Operations & Complexity
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Push: O(1) - Add element to top</li>
                <li>Pop: O(1) - Remove top element</li>
                <li>Peek: O(1) - View top element</li>
                <li>Search: O(n) - Find element in stack</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-green-400" /> Advantages
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Efficient data management with LIFO</li>
                <li>Automatic memory management</li>
                <li>Simple implementation</li>
                <li>Fast access to top element</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <XCircle className="text-red-400" /> Disadvantages
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Limited size in array implementation</li>
                <li>No random access to elements</li>
                <li>Risk of stack overflow/underflow</li>
                <li>Memory size constraints</li>
              </ul>
            </div>

            <div className="md:col-span-2 bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" /> Applications
              </h3>
              <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>Expression evaluation</li>
                <li>Function call management</li>
                <li>Backtracking algorithms</li>
                <li>Syntax parsing</li>
                <li>Memory management</li>
                <li>Undo/Redo operations</li>
                <li>Browser history</li>
                <li>Text editor operations</li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 mb-8 w-full max-w-5xl mx-auto">
  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
    <BookOpen className="text-yellow-400" /> Python Implementation
  </h3>
  <div className="bg-gray-700 p-4 rounded overflow-auto max-h-96 w-full">
    <pre className="whitespace-pre-wrap text-sm">
{`class Stack:
    def __init__(self, max_size=10):
        self.stack = []
        self.max_size = max_size

    def push(self, value):
        if len(self.stack) < self.max_size:
            self.stack.append(value)
            print(f"Pushed {value} into the stack.")
        else:
            print("Stack Overflow: Cannot add more elements.")

    def pop(self):
        if self.is_empty():
            print("Stack Underflow: No elements to pop.")
        else:
            popped_value = self.stack.pop()
            print(f"Popped {popped_value} from the stack.")

    def peek(self):
        return self.stack[-1] if not self.is_empty() else None

    def is_empty(self):
        return len(self.stack) == 0

    def search(self, value):
        if value in self.stack:
            index = len(self.stack) - self.stack[::-1].index(value) - 1
            print(f"Element {value} found at index {index}.")
        else:
            print(f"Element {value} not found in stack.")

    def clear(self):
        self.stack = []
        print("Stack cleared.")

    def display(self):
        print("Stack:", self.stack[::-1] if not self.is_empty() else "Empty")

if __name__ == "__main__":
    my_stack = Stack()
    my_stack.push(10)
    my_stack.push(20)
    my_stack.push(30)
    my_stack.display()
    my_stack.pop()
    my_stack.display()
    print("Peek:", my_stack.peek())
    my_stack.search(10)
    my_stack.clear()
    my_stack.display()
`}
    </pre>
  </div>
</div>


          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex gap-2">
            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a number"
            />
            <button
              onClick={pushElement}
              className={`px-6 py-2 rounded transition-colors ${
                activeButton === "push" ? "bg-green-500" : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              Push
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search a number"
            />
            <button
              onClick={searchElement}
              className={`px-6 py-2 rounded transition-colors ${
                activeButton === "search" ? "bg-green-500" : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={popElement}
            className={`px-6 py-2 rounded transition-colors ${
              activeButton === "pop" ? "bg-green-500" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            Pop
          </button>
          <button
            onClick={peekElement}
            className={`px-6 py-2 rounded transition-colors ${
              activeButton === "peek" ? "bg-green-500" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            Peek
          </button>
          <button
            onClick={clearStack}
            className={`px-6 py-2 rounded transition-colors ${
              activeButton === "clear" ? "bg-green-500" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            Clear
          </button>
        </div>

        <div className="relative min-h-[400px] bg-gray-900 rounded-lg p-4">
          <AnimatePresence>
            {stack.map((num, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: index * 60,
                }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className={`absolute w-full left-0 px-4 ${
                  index === 0
                    ? "bg-blue-600"
                    : index === searchIndex
                    ? "bg-green-600"
                    : "bg-blue-500"
                }`}
                style={{
                  height: "50px",
                  borderRadius: "8px",
                }}
              >
                <div className="flex items-center justify-between h-full">
                  <span className="text-sm">Index: {index}</span>
                  <span className="text-xl font-bold">{num}</span>
                  {index === 0 && <span className="text-sm">← Top</span>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {stack.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Stack is empty
            </div>
          )}
        </div>

        {peekValue !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg font-bold mt-4 bg-yellow-500/20 p-2 rounded"
          >
            Top element (Peek): {peekValue}
          </motion.div>
        )}

        {searchIndex === null && searchValue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg font-bold mt-4 bg-red-500/20 p-2 rounded"
          >
            Element not found!
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Stack;