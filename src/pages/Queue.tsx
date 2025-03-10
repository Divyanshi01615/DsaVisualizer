import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GitBranch, Code2, CheckCircle2, XCircle, AlertTriangle, List, ArrowRight, ArrowLeft } from 'lucide-react';

interface QueueItem {
  value: number;
  x: number;
  y: number;
  priority?: number;
}

type QueueType = 'simple' | 'circular' | 'priority' | 'deque';

const MAX_SIZE = 8;

const Queue = () => {
  const [queueType, setQueueType] = useState<QueueType>('simple');
  const [items, setItems] = useState<QueueItem[]>([]);
  const [animatingItem, setAnimatingItem] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resetQueue = () => {
    setItems([]);
    setFront(0);
    setRear(-1);
    setOperation(null);
    setAnimatingItem(null);
  };

  const enqueue = (value: number) => {
    if (queueType === 'circular' && items.length >= MAX_SIZE) {
      alert('Circular Queue is full!');
      return;
    }
    
    let newItem: QueueItem = {
      value,
      x: items.length * 100 + 50,
      y: 150,
      priority: queueType === 'priority' ? Math.floor(Math.random() * 10) : undefined
    };

    if (queueType === 'priority') {
      const newItems = [...items, newItem].sort((a, b) => (b.priority || 0) - (a.priority || 0));
      newItems.forEach((item, index) => {
        item.x = index * 100 + 50;
      });
      setItems(newItems);
    } else if (queueType === 'circular') {
      const nextRear = (rear + 1) % MAX_SIZE;
      newItem.x = nextRear * 100 + 50;
      setRear(nextRear);
      setItems(prev => {
        const newItems = [...prev];
        newItems[nextRear] = newItem;
        return newItems;
      });
    } else {
      setItems(prev => [...prev, newItem]);
    }

    setAnimatingItem(items.length);
    setOperation('enqueue');
    setTimeout(() => setOperation(null), 500);
  };

  const dequeue = () => {
    if (items.length === 0) {
      alert('Queue is empty!');
      return;
    }

    setAnimatingItem(0);
    setOperation('dequeue');

    if (queueType === 'circular') {
      setTimeout(() => {
        setItems(prev => {
          const newItems = [...prev];
          newItems[front] = undefined as any;
          return newItems;
        });
        setFront((front + 1) % MAX_SIZE);
      }, 500);
    } else {
      setTimeout(() => {
        setItems(prev => prev.slice(1).map((item, index) => ({
          ...item,
          x: index * 100 + 50
        })));
      }, 500);
    }

    setTimeout(() => {
      setAnimatingItem(null);
      setOperation(null);
    }, 500);
  };

  const enqueueFront = (value: number) => {
    if (queueType !== 'deque') return;
    
    const newItem: QueueItem = {
      value,
      x: 50,
      y: 150
    };

    setItems(prev => [newItem, ...prev.map(item => ({
      ...item,
      x: item.x + 100
    }))]);
    
    setAnimatingItem(0);
    setOperation('enqueueFront');
    setTimeout(() => setOperation(null), 500);
  };

  const dequeueRear = () => {
    if (queueType !== 'deque' || items.length === 0) return;
    
    setAnimatingItem(items.length - 1);
    setOperation('dequeueRear');
    
    setTimeout(() => {
      setItems(prev => prev.slice(0, -1));
      setAnimatingItem(null);
      setOperation(null);
    }, 500);
  };

  const drawQueue = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // Draw queue container
    ctx.beginPath();
    ctx.rect(30, 100, 740, 100);
    ctx.strokeStyle = '#4a5568';
    ctx.stroke();

    // Draw items
    items.forEach((item, i) => {
      if (!item) return; // Skip empty slots in circular queue

      // Draw item box
      ctx.beginPath();
      ctx.rect(item.x - 30, item.y - 30, 60, 60);
      ctx.fillStyle = animatingItem === i ? '#22c55e' : '#1f2937';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();

      // Draw value and priority if applicable
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), item.x, item.y + 6);
      
      if (queueType === 'priority' && item.priority !== undefined) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = '12px Arial';
        ctx.fillText(`P:${item.priority}`, item.x, item.y - 20);
      }

      // Draw front/rear indicators
      if (queueType === 'circular') {
        if (i === front) {
          ctx.fillStyle = '#60a5fa';
          ctx.fillText('Front', item.x, item.y - 40);
        }
        if (i === rear) {
          ctx.fillStyle = '#f87171';
          ctx.fillText('Rear', item.x, item.y - 40);
        }
      } else {
        if (i === 0) {
          ctx.fillStyle = '#60a5fa';
          ctx.fillText('Front', item.x, item.y - 40);
        }
        if (i === items.length - 1) {
          ctx.fillStyle = '#f87171';
          ctx.fillText('Rear', item.x, item.y - 40);
        }
      }
    });

    // Draw operation indicator
    if (operation) {
      ctx.fillStyle = '#22c55e';
      ctx.font = '20px Arial';
      ctx.fillText(operation.toUpperCase(), 400, 50);
    }

    // Draw circular connection for circular queue
    if (queueType === 'circular' && items.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#4a5568';
      ctx.moveTo(770, 150);
      ctx.bezierCurveTo(790, 150, 790, 50, 30, 50);
      ctx.lineTo(30, 150);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawQueue();
  }, [items, animatingItem, operation, queueType]);

  useEffect(() => {
    resetQueue();
  }, [queueType]);

  const getPythonImplementation = () => {
    switch (queueType) {
      case 'simple':
        return `class Queue:
    def __init__(self):
        self.items = []
        
    def is_empty(self):
        return len(self.items) == 0
        
    def enqueue(self, item):
        self.items.append(item)
        
    def dequeue(self):
        if not self.is_empty():
            return self.items.pop(0)
        raise IndexError("Queue is empty")
        
    def peek(self):
        if not self.is_empty():
            return self.items[0]
        raise IndexError("Queue is empty")`;

      case 'circular':
        return `class CircularQueue:
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = self.rear = -1
        
    def is_full(self):
        return (self.rear + 1) % self.size == self.front
        
    def is_empty(self):
        return self.front == -1
        
    def enqueue(self, item):
        if self.is_full():
            raise IndexError("Queue is full")
        elif self.is_empty():
            self.front = self.rear = 0
        else:
            self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = item
        
    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        item = self.queue[self.front]
        if self.front == self.rear:
            self.front = self.rear = -1
        else:
            self.front = (self.front + 1) % self.size
        return item`;

      case 'priority':
        return `class PriorityQueue:
    def __init__(self):
        self.queue = []
        
    def is_empty(self):
        return len(self.queue) == 0
        
    def enqueue(self, item, priority):
        self.queue.append((priority, item))
        self.queue.sort(reverse=True)
        
    def dequeue(self):
        if not self.is_empty():
            return self.queue.pop(0)[1]
        raise IndexError("Queue is empty")
        
    def peek(self):
        if not self.is_empty():
            return self.queue[0][1]
        raise IndexError("Queue is empty")`;

      case 'deque':
        return `class Deque:
    def __init__(self):
        self.items = []
        
    def is_empty(self):
        return len(self.items) == 0
        
    def add_front(self, item):
        self.items.insert(0, item)
        
    def add_rear(self, item):
        self.items.append(item)
        
    def remove_front(self):
        if not self.is_empty():
            return self.items.pop(0)
        raise IndexError("Deque is empty")
        
    def remove_rear(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("Deque is empty")`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white p-4">
      <div className="mb-6 bg-gray-900 p-4 rounded">
        <h2 className="text-3xl font-bold">Queue Implementation</h2>
        <p className="mt-4">A Queue is a linear data structure which follows the particular order inwhich the operations are performed. The order is FIFO(First In Firts Out)..</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setQueueType('simple')}
          className={`px-4 py-2 rounded ${
            queueType === 'simple' ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          Simple Queue
        </button>
        <button
          onClick={() => setQueueType('circular')}
          className={`px-4 py-2 rounded ${
            queueType === 'circular' ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          Circular Queue
        </button>
        <button
          onClick={() => setQueueType('priority')}
          className={`px-4 py-2 rounded ${
            queueType === 'priority' ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          Priority Queue
        </button>
        <button
          onClick={() => setQueueType('deque')}
          className={`px-4 py-2 rounded ${
            queueType === 'deque' ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          Double Ended Queue
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => enqueue(Math.floor(Math.random() * 100))}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          {queueType === 'deque' ? 'Enqueue Rear' : 'Enqueue'}
        </button>
        <button
          onClick={dequeue}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          disabled={items.length === 0}
        >
          {queueType === 'deque' ? 'Dequeue Front' : 'Dequeue'}
        </button>
        {queueType === 'deque' && (
          <>
            <button
              onClick={() => enqueueFront(Math.floor(Math.random() * 100))}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Enqueue Front
            </button>
            <button
              onClick={dequeueRear}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              disabled={items.length === 0}
            >
              Dequeue Rear
            </button>
          </>
        )}
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
            <List className="text-blue-400" /> Implementation Details
          </h3>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Time Complexity:</h4>
            <ul className="space-y-1">
              <li>• Enqueue: {queueType === 'priority' ? 'O(n log n)' : 'O(1)'}</li>
              <li>• Dequeue: O(1)</li>
              <li>• Peek: O(1)</li>
              <li>• Search: O(n)</li>
            </ul>
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
            <li>• {queueType === 'priority' ? 'Priority-based ordering' : 'FIFO (First In First Out)'}</li>
            <li>• {queueType === 'circular' ? 'Circular structure' : 'Linear data structure'}</li>
            <li>• {queueType === 'deque' ? 'Double-ended access' : 'Sequential access'}</li>
            <li>• {queueType === 'circular' ? 'Fixed size' : 'Dynamic size'}</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-400" /> Applications
          </h3>
          <ul className="space-y-2">
            {queueType === 'priority' ? (
              <>
                <li>• CPU Scheduling</li>
                <li>• Dijkstra's algorithm</li>
                <li>• Event handling</li>
              </>
            ) : queueType === 'circular' ? (
              <>
                <li>• Memory management</li>
                <li>• Traffic light control</li>
                <li>• CPU scheduling</li>
              </>
            ) : queueType === 'deque' ? (
              <>
                <li>• Task scheduling</li>
                <li>• Browser history</li>
                <li>• Undo operations</li>
              </>
            ) : (
              <>
                <li>• Process scheduling</li>
                <li>• Print job scheduling</li>
                <li>• Breadth-first search</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Queue;