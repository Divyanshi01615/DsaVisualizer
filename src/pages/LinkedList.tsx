import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GitBranch, Code2, CheckCircle2, XCircle, AlertTriangle, List, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface Node {
  value: number;
  x: number;
  y: number;
}

type ListType = 'singly' | 'doubly' | 'circular';

const LinkedList = () => {
  const [listType, setListType] = useState<ListType>('singly');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [animatingNode, setAnimatingNode] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const addNode = (value: number) => {
    const newNode: Node = {
      value,
      x: nodes.length * 100 + 50,
      y: 150
    };
    setNodes([...nodes, newNode]);
    setAnimatingNode(nodes.length);
  };

  const deleteNode = (index: number) => {
    setAnimatingNode(index);
    setTimeout(() => {
      const newNodes = nodes.filter((_, i) => i !== index);
      setNodes(newNodes);
      setAnimatingNode(null);
    }, 500);
  };

  const reverseList = () => {
    setOperation('reverse');
    setTimeout(() => {
      setNodes([...nodes].reverse());
      setOperation(null);
    }, 1000);
  };

  const drawList = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    nodes.forEach((node, i) => {
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = animatingNode === i ? '#22c55e' : '#1f2937';
      ctx.fill();
      ctx.stroke();

      // Draw value
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.value.toString(), node.x, node.y + 5);

      // Draw arrows based on list type
      if (i < nodes.length - 1) {
        const nextNode = nodes[i + 1];
        
        // Forward arrow
        ctx.beginPath();
        ctx.moveTo(node.x + 20, node.y);
        ctx.lineTo(nextNode.x - 20, nextNode.y);
        ctx.stroke();

        // Forward arrowhead
        ctx.beginPath();
        ctx.moveTo(nextNode.x - 20, nextNode.y);
        ctx.lineTo(nextNode.x - 30, nextNode.y - 10);
        ctx.lineTo(nextNode.x - 30, nextNode.y + 10);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();

        // For doubly linked list, draw backward arrow
        if (listType === 'doubly') {
          ctx.beginPath();
          ctx.moveTo(nextNode.x - 20, nextNode.y + 10);
          ctx.lineTo(node.x + 20, node.y + 10);
          ctx.stroke();

          // Backward arrowhead
          ctx.beginPath();
          ctx.moveTo(node.x + 20, node.y + 10);
          ctx.lineTo(node.x + 30, node.y);
          ctx.lineTo(node.x + 30, node.y + 20);
          ctx.closePath();
          ctx.fillStyle = 'white';
          ctx.fill();
        }
      }

      // For circular list, connect last to first
      if (listType === 'circular' && i === nodes.length - 1 && nodes.length > 0) {
        ctx.beginPath();
        ctx.moveTo(node.x + 20, node.y);
        
        // Create curved line back to first node
        ctx.bezierCurveTo(
          node.x + 50,
          node.y + 50,
          nodes[0].x - 50,
          nodes[0].y + 50,
          nodes[0].x - 20,
          nodes[0].y
        );
        ctx.stroke();

        // Draw arrowhead for circular connection
        ctx.beginPath();
        ctx.moveTo(nodes[0].x - 20, nodes[0].y);
        ctx.lineTo(nodes[0].x - 30, nodes[0].y - 10);
        ctx.lineTo(nodes[0].x - 30, nodes[0].y + 10);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    drawList();
  }, [nodes, animatingNode, listType]);

  const getPythonImplementation = () => {
    switch (listType) {
      case 'singly':
        return `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    def delete(self, key):
        if not self.head:
            return
        if self.head.data == key:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.data == key:
                current.next = current.next.next
                return
            current = current.next

    def reverse(self):
        prev = None
        current = self.head
        while current:
            next_temp = current.next
            current.next = prev
            prev = current
            current = next_temp
        self.head = prev`;

      case 'doubly':
        return `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
        new_node.prev = current

    def delete(self, key):
        if not self.head:
            return
        current = self.head
        if current.data == key:
            if current.next:
                current.next.prev = None
            self.head = current.next
            return
        while current:
            if current.data == key:
                if current.next:
                    current.next.prev = current.prev
                current.prev.next = current.next
                return
            current = current.next

    def reverse(self):
        temp = None
        current = self.head
        while current:
            # Swap next and prev
            temp = current.prev
            current.prev = current.next
            current.next = temp
            # Move to next node
            current = current.prev
        # Update head
        if temp:
            self.head = temp.prev`;

      case 'circular':
        return `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class CircularLinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            new_node.next = self.head
            return
        current = self.head
        while current.next != self.head:
            current = current.next
        current.next = new_node
        new_node.next = self.head

    def delete(self, key):
        if not self.head:
            return
        # If head is to be deleted
        if self.head.data == key:
            if self.head.next == self.head:
                self.head = None
            else:
                current = self.head
                while current.next != self.head:
                    current = current.next
                current.next = self.head.next
                self.head = self.head.next
            return
        # Delete node other than head
        current = self.head
        while current.next != self.head:
            if current.next.data == key:
                current.next = current.next.next
                return
            current = current.next

    def reverse(self):
        if not self.head:
            return
        # Get the last node
        last = self.head
        while last.next != self.head:
            last = last.next
        # Reverse the list
        prev = last
        current = self.head
        while True:
            next_temp = current.next
            current.next = prev
            prev = current
            current = next_temp
            if current == self.head:
                break
        self.head = prev`;
    }
  };

  const getComplexityInfo = () => {
    switch (listType) {
      case 'singly':
        return {
          insertion: {
            start: 'O(1)',
            end: 'O(n)',
            position: 'O(n)'
          },
          deletion: {
            start: 'O(1)',
            end: 'O(n)',
            position: 'O(n)'
          },
          search: 'O(n)',
          space: 'O(n)',
          reverse: 'O(n)'
        };
      case 'doubly':
        return {
          insertion: {
            start: 'O(1)',
            end: 'O(1)',
            position: 'O(n)'
          },
          deletion: {
            start: 'O(1)',
            end: 'O(1)',
            position: 'O(n)'
          },
          search: 'O(n)',
          space: 'O(n)',
          reverse: 'O(n)'
        };
      case 'circular':
        return {
          insertion: {
            start: 'O(n)',
            end: 'O(n)',
            position: 'O(n)'
          },
          deletion: {
            start: 'O(n)',
            end: 'O(n)',
            position: 'O(n)'
          },
          search: 'O(n)',
          space: 'O(n)',
          reverse: 'O(n)'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white p-4">
      <div className="mb-6 bg-gray-900 p-4 rounded">
        <h2 className="text-3xl font-bold">Linked List Implementation</h2>
        <p className="mt-4">Interactive visualization of different types of linked lists and their operations. A linked list is a linear data structure as well as a dynamic data structure.A linked list consists of nodes where each node contains a data field and reference(address) to the next node in the list.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setListType('singly')}
          className={`px-4 py-2 rounded ${
            listType === 'singly' ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          Singly Linked
        </button>
        <button
          onClick={() => setListType('doubly')}
          className={`px-4 py-2 rounded ${
            listType === 'doubly' ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          Doubly Linked
        </button>
        <button
          onClick={() => setListType('circular')}
          className={`px-4 py-2 rounded ${
            listType === 'circular' ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          Circular
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => addNode(Math.floor(Math.random() * 100))}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Node
        </button>
        <button
          onClick={() => deleteNode(nodes.length - 1)}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          disabled={nodes.length === 0}
        >
          Delete Node
        </button>
        <button
          onClick={reverseList}
          className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600"
          disabled={nodes.length < 2}
        >
          Reverse List
        </button>
      </div>

      <div className="mb-8">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full border border-gray-700 rounded bg-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <List className="text-blue-400" /> Time Complexity
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Insertion:</h4>
              <ul className="space-y-1">
                <li>• At start: {getComplexityInfo()?.insertion.start}</li>
                <li>• At end: {getComplexityInfo()?.insertion.end}</li>
                <li>• At position: {getComplexityInfo()?.insertion.position}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Deletion:</h4>
              <ul className="space-y-1">
                <li>• At start: {getComplexityInfo()?.deletion.start}</li>
                <li>• At end: {getComplexityInfo()?.deletion.end}</li>
                <li>• At position: {getComplexityInfo()?.deletion.position}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Other Operations:</h4>
              <ul className="space-y-1">
                <li>• Search: {getComplexityInfo()?.search}</li>
                <li>• Space: {getComplexityInfo()?.space}</li>
                <li>• Reverse: {getComplexityInfo()?.reverse}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="text-green-400" /> Python Implementation
          </h3>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto">
            {getPythonImplementation()}
          </pre>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-yellow-400" /> Properties
          </h3>
          <ul className="space-y-2">
            {listType === 'singly' ? (
              <>
                <li>• Sequential access only</li>
                <li>• Simple implementation</li>
                <li>• Less memory usage</li>
                <li>• Cannot traverse backwards</li>
              </>
            ) : listType === 'doubly' ? (
              <>
                <li>• Bidirectional traversal</li>
                <li>• More complex implementation</li>
                <li>• Higher memory usage</li>
                <li>• Easier deletion</li>
              </>
            ) : (
              <>
                <li>• No NULL termination</li>
                <li>• Last node connects to first</li>
                <li>• Useful for round-robin</li>
                <li>• Continuous traversal</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-400" /> Applications
          </h3>
          <ul className="space-y-2">
            {listType === 'singly' ? (
              <>
                <li>• Stack implementation</li>
                <li>• Hash tables with chaining</li>
                <li>• Undo functionality</li>
                <li>• Symbol table management</li>
              </>
            ) : listType === 'doubly' ? (
              <>
                <li>• Browser history</li>
                <li>• Music player playlists</li>
                <li>• LRU Cache implementation</li>
                <li>• Undo/Redo operations</li>
              </>
            ) : (
              <>
                <li>• Round-robin scheduling</li>
                <li>• Game turn management</li>
                <li>• Circular buffers</li>
                <li>• Task scheduling</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded">
        <h3 className="text-2xl font-bold mb-4">Common Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Basic Operations</h4>
            <ul className="space-y-1">
              <li>• Insertion (start/end/position)</li>
              <li>• Deletion (start/end/position)</li>
              <li>• Traversal</li>
              <li>• Search</li>
              <li>• Reverse</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Advanced Operations</h4>
            <ul className="space-y-1">
              <li>• Cycle detection</li>
              <li>• Merge sorted lists</li>
              <li>• Find middle element</li>
              <li>• Remove duplicates</li>
              <li>• Sort the list</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedList;