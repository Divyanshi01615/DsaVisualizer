import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Binary, Search, Share2, Braces, GitBranch, TreePine, Calculator, Github, Linkedin, Mail } from 'lucide-react';

const algorithms = [
  {
    path: '/arrays',
    name: 'Arrays',
    icon: <Code2 className="w-8 h-8" />,
    description: 'Learn about array operations and manipulations',
  },
  {
    path: '/stack',
    name: 'Stack',
    icon: <Code2 className="w-8 h-8" />,
    description: 'Learn about stack operations and manipulations',
  },
  {
    path: '/linkedlist',
    name: 'LinkedList',
    icon: <Code2 className="w-8 h-8" />,
    description: 'Learn about Linkedlist operations and manipulations',
  },
  {
    path: '/queue',
    name: 'Queue',
    icon: <Code2 className="w-8 h-8" />,
    description: 'Queue operations and manipulations',
  },
  {
    path: '/sorting',
    name: 'Sorting',
    icon: <Binary className="w-8 h-8" />,
    description: 'Visualize different sorting algorithms in action',
  },
  {
    path: '/searching',
    name: 'Searching',
    icon: <Search className="w-8 h-8" />,
    description: 'Understand linear and binary search algorithms',
  },
  {
    path: '/graph',
    name: 'Graph',
    icon: <Share2 className="w-8 h-8" />,
    description: 'Explore graph traversal and pathfinding algorithms',
  },
  {
    path: '/dynamic-programming',
    name: 'Dynamic Programming',
    icon: <Braces className="w-8 h-8" />,
    description: 'Learn optimization through dynamic programming',
  },
  {
    path: '/greedy',
    name: 'Greedy',
    icon: <GitBranch className="w-8 h-8" />,
    description: 'Study greedy algorithmic approaches',
  },
  {
    path: '/backtracking',
    name: 'Backtracking',
    icon: <GitBranch className="w-8 h-8" />,
    description: 'Visualize backtracking problem solutions',
  },
  {
    path: '/trees',
    name: 'Trees',
    icon: <TreePine className="w-8 h-8" />,
    description: 'Learn tree data structures and operations',
  },
  {
    path: '/mathematical',
    name: 'Mathematical',
    icon: <Calculator className="w-8 h-8" />,
    description: 'Explore mathematical algorithms',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to DSA Visualizer
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Interactive visualizations to help you understand Data Structures and Algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {algorithms.map((algo, index) => (
            <motion.div
              key={algo.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={algo.path}
                className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition duration-300"
              >
                <div className="flex items-center justify-center mb-4 text-blue-500">
                  {algo.icon}
                </div>
                <h2 className="text-xl font-semibold text-white text-center mb-2">
                  {algo.name}
                </h2>
                <p className="text-gray-400 text-center">{algo.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 bg-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Contact Me</h2>
          
          <div className="grid grid-cols-1 gap-12">
            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-12">
            {/* Social Links */}
            <div className="flex space-x-6 ustify-center ">
              <a 
                href="https://github.com/Divyanshi01615" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Github className="h-6 w-6" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/divyanshi-singh-bhadauriya-47592b283/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
                <span>LinkedIn</span>
              </a>
              <a 
                href="mailto:singhbhadauriyadivyanshi@gmail.com" 
                className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Mail className="h-6 w-6" />
                <span>Email</span>
              </a>
            </div>
          </div>
          </div>
          {/* Profile Info */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-white">Divyanshi Singh Bhadauriya</h3>
            <p className="text-gray-300 mt-2">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;