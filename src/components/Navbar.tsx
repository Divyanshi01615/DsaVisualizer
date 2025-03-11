import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Code2, Binary, Search, Share2, Braces, GitBranch, TreePine, Calculator } from 'lucide-react';

const navItems = [
  { path: '/arrays', name: 'Arrays', icon: Code2 },
  { path: '/stack', name: 'Stack', icon: Code2 },
  { path: '/linkedlist', name: 'LinkedList', icon: Code2 },
  { path: '/queue', name: 'Queue', icon: Code2 },
  { path: '/sorting', name: 'Sorting', icon: Binary },
  { path: '/searching', name: 'Searching', icon: Search },
  { path: '/graph', name: 'Graph', icon: Share2 },
  { path: '/dynamic-programming', name: 'Dynamic Programming', icon: Braces },
  { path: '/greedy', name: 'Greedy', icon: GitBranch },
  { path: '/backtracking', name: 'Backtracking', icon: GitBranch },
  { path: '/trees', name: 'Trees', icon: TreePine },
  { path: '/mathematical', name: 'Mathematical', icon: Calculator },
  { path: '/algorithmrace', name: 'AlgorithmRace', icon: Search },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg w-full">
      <div className="px-2 md:px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="text-white text-lg font-semibold">
              DSA Visualizer
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ path, name, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="text-gray-300 hover:text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
              >
                <Icon className="w-4 h-4" />
                {name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-gray-800 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-3 py-2 space-y-1">
          {navItems.map(({ path, name, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="text-gray-300 hover:text-white block px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
