import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Arrays from './pages/Arrays';
import Stack from './pages/Stack';
import Queue from './pages/Queue';
import LinkedList from './pages/LinkedList';
import Sorting from './pages/Sorting';
import Searching from './pages/Searching';
import Graph from './pages/Graph';
import DynamicProgramming from './pages/DynamicProgramming';
import Greedy from './pages/Greedy';
import Backtracking from './pages/Backtracking';
import Trees from './pages/Trees';
import Mathematical from './pages/Mathematical';
import AlgorithmRace from './pages/AlgorithmRace';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/arrays" element={<Arrays />} />
            <Route path="/stack" element={<Stack />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/linkedlist" element={<LinkedList />} />
            <Route path="/sorting" element={<Sorting />} />
            <Route path="/searching" element={<Searching />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/dynamic-programming" element={<DynamicProgramming />} />
            <Route path="/greedy" element={<Greedy />} />
            <Route path="/backtracking" element={<Backtracking />} />
            <Route path="/trees" element={<Trees />} />
            <Route path="/mathematical" element={<Mathematical />} />
            <Route path="/algorithmrace" element={<AlgorithmRace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
console.log('Rendering App component');
console.log('Rendering Navbar component');
console.log('Rendering Home component');
console.log('Rendering Arrays component');
console.log('Rendering Stack component');
console.log('Rendering Queue component');
console.log('Rendering LinkedList component');
console.log('Rendering Sorting component');
console.log('Rendering Searching component');
console.log('Rendering Graph component');
console.log('Rendering DynamicProgramming component');
console.log('Rendering Greedy component');
console.log('Rendering Backtracking component');
console.log('Rendering Trees component');
console.log('Rendering Mathematical component');