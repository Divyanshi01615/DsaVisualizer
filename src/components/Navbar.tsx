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
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg w-full">
      <div className="px-4 md:px-2"> {/* Left-aligned content */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              DSA Visualizer
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {navItems.map(({ path, name, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <Icon className="w-5 h-5" />
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
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-gray-800 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-2">
          {navItems.map(({ path, name, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
