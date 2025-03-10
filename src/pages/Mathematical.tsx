import React, { useState, useEffect, useRef } from 'react';
import { Code, Info } from 'lucide-react';

// Algorithm components
const MathematicalAlgorithms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('gcd');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className=" text-white py-12 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Mathematical Algorithms</h1>
          <p className="text-xl opacity-90">
            Interactive visualizations of fundamental mathematical algorithms
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-wrap mb-8 border-b border-gray-700">
          <TabButton 
            active={activeTab === 'gcd'} 
            onClick={() => setActiveTab('gcd')}
            label="GCD (Euclidean)"
          />
          <TabButton 
            active={activeTab === 'sieve'} 
            onClick={() => setActiveTab('sieve')}
            label="Sieve of Eratosthenes"
          />
          <TabButton 
            active={activeTab === 'prime'} 
            onClick={() => setActiveTab('prime')}
            label="Prime Factorization"
          />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {activeTab === 'gcd' && <GCDAlgorithm />}
          {activeTab === 'sieve' && <SieveAlgorithm />}
          {activeTab === 'prime' && <PrimeFactorizationAlgorithm />}
        </div>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    className={`px-4 py-2 font-medium text-sm mr-2 transition-colors duration-200 rounded-lg ${
      active 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-300 hover:bg-gray-600'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Algorithm Info Component
const AlgorithmInfo: React.FC<{
  title: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
}> = ({ title, description, timeComplexity, spaceComplexity, code }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-100 mb-4">{title}</h2>
    <p className="mb-6 text-gray-300">{description}</p>
    
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Info className="w-5 h-5 mr-2 text-gray-400" />
        Complexity Analysis
      </h3>
      <div className="bg-gray-700 p-4 rounded-md shadow">
        <p className="mb-2"><span className="font-medium">Time Complexity:</span> {timeComplexity}</p>
        <p><span className="font-medium">Space Complexity:</span> {spaceComplexity}</p>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Code className="w-5 h-5 mr-2 text-gray-400" />
        Implementation
      </h3>
      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  </div>
);

// GCD Algorithm Component
const GCDAlgorithm: React.FC = () => {
  const [num1, setNum1] = useState<number>(48);
  const [num2, setNum2] = useState<number>(18);
  const [steps, setSteps] = useState<Array<{a: number, b: number, remainder: number}>>([]);
  const [animationStep, setAnimationStep] = useState<number>(-1);
  const [gcdResult, setGcdResult] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  const calculateGCD = (a: number, b: number): number => {
    const calculationSteps: Array<{a: number, b: number, remainder: number}> = [];
    let tempA = Math.max(a, b);
    let tempB = Math.min(a, b);
    
    while (tempB !== 0) {
      const remainder = tempA % tempB;
      calculationSteps.push({ a: tempA, b: tempB, remainder });
      tempA = tempB;
      tempB = remainder;
    }
    
    setSteps(calculationSteps);
    return tempA;
  };

  const handleCalculate = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const result = calculateGCD(num1, num2);
    setGcdResult(result);
    setAnimationStep(-1);
    
    // Start animation
    let step = 0;
    const animate = () => {
      if (step <= steps.length) {
        setAnimationStep(step);
        step++;
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    handleCalculate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [num1, num2]);

  const gcdCode = `function gcd(a, b) {
  // Ensure a is the larger number
  if (a < b) [a, b] = [b, a];
  
  // Base case
  if (b === 0) return a;
  
  // Recursive case
  return gcd(b, a % b);
}`;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <AlgorithmInfo
            title="GCD (Euclidean Algorithm)"
            description="The Euclidean Algorithm is an efficient method for computing the greatest common divisor (GCD) of two integers. The algorithm is based on the principle that if a and b are two positive integers, then gcd(a, b) = gcd(b, a mod b)."
            timeComplexity="O(log(min(a, b)))"
            spaceComplexity="O(1) iterative, O(log(min(a, b))) recursive"
            code={gcdCode}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Demonstration</h3>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Number</label>
              <input
                type="number"
                min="1"
                value={num1}
                onChange={(e) => setNum1(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Second Number</label>
              <input
                type="number"
                min="1"
                value={num2}
                onChange={(e) => setNum2(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md mb-4 shadow">
            <h4 className="font-medium mb-2">Calculation Steps:</h4>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded transition-colors duration-300 ${
                    animationStep === index ? 'bg-gray-600 border-l-4 border-gray-400' : ''
                  }`}
                >
                  <p>
                    Step {index + 1}: {step.a} = {step.b} × {Math.floor(step.a / step.b)} + {step.remainder}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-600 p-4 rounded-md shadow">
            <p className="text-lg">
              GCD({num1}, {num2}) = <span className="font-bold text-white">{gcdResult}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sieve of Eratosthenes Algorithm Component
const SieveAlgorithm: React.FC = () => {
  const [limit, setLimit] = useState<number>(50);
  const [primes, setPrimes] = useState<boolean[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(-1);
  const [currentMultiple, setCurrentMultiple] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationRef = useRef<number | null>(null);
  const animationSpeedRef = useRef<number>(500);

  const sieveOfEratosthenes = (n: number): boolean[] => {
    const isPrime = Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let i = 2; i * i <= n; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= n; j += i) {
          isPrime[j] = false;
        }
      }
    }
    
    return isPrime;
  };

  const runAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsAnimating(true);
    const isPrime = Array(limit + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    setPrimes(isPrime);
    
    let p = 2;
    let multiple = -1;
    
    const animate = () => {
      if (p * p > limit) {
        setIsAnimating(false);
        setCurrentNumber(-1);
        setCurrentMultiple(-1);
        return;
      }
      
      if (multiple === -1) {
        // Start marking multiples of p
        if (isPrime[p]) {
          setCurrentNumber(p);
          multiple = p * p;
        } else {
          // If p is not prime, move to next number
          p++;
          animationRef.current = setTimeout(animate, 50) as unknown as number;
          return;
        }
      }
      
      if (multiple <= limit) {
        setCurrentMultiple(multiple);
        
        // Mark multiple as not prime
        isPrime[multiple] = false;
        setPrimes([...isPrime]);
        
        // Move to next multiple
        multiple += p;
        
        animationRef.current = setTimeout(animate, animationSpeedRef.current) as unknown as number;
      } else {
        // Done with current prime, move to next number
        p++;
        multiple = -1;
        setCurrentMultiple(-1);
        animationRef.current = setTimeout(animate, 300) as unknown as number;
      }
    };
    
    animationRef.current = setTimeout(animate, 300) as unknown as number;
  };

  const handleStart = () => {
    if (!isAnimating) {
      runAnimation();
    }
  };

  const handleReset = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsAnimating(false);
    setCurrentNumber(-1);
    setCurrentMultiple(-1);
    setPrimes([]);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const sieveCode = `function sieveOfEratosthenes(n) {
  // Create array initialized as potentially prime
  const isPrime = Array(n + 1).fill(true);
  
  // 0 and 1 are not prime
  isPrime[0] = isPrime[1] = false;
  
  // Check all potential primes
  for (let p = 2; p * p <= n; p++) {
    // If p is prime, mark its multiples
    if (isPrime[p]) {
      // Start at p*p as smaller multiples already marked
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }
  
  // Filter the array to get only prime numbers
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  
  return primes;
}`;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <AlgorithmInfo
            title="Sieve of Eratosthenes"
            description="The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to a specified limit. It works by iteratively marking the multiples of each prime, starting from 2. The remaining unmarked numbers are prime."
            timeComplexity="O(n log log n)"
            spaceComplexity="O(n)"
            code={sieveCode}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Demonstration</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Upper Limit</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="10"
                max="200"
                value={limit}
                onChange={(e) => setLimit(Math.min(200, Math.max(10, parseInt(e.target.value) || 10)))}
                disabled={isAnimating}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <select 
                className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={animationSpeedRef.current}
                onChange={(e) => { animationSpeedRef.current = parseInt(e.target.value); }}
                disabled={isAnimating}
              >
                <option value="100">Fast</option>
                <option value="500">Medium</option>
                <option value="1000">Slow</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleStart}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-md font-medium ${
                isAnimating 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gray-600 text-white hover:bg-gray-500 transition duration-200'
              }`}
            >
              Start Animation
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-700 rounded-md font-medium hover:bg-gray-600 transition duration-200"
            >
              Reset
            </button>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md overflow-y-auto shadow" style={{ maxHeight: '400px' }}>
            <div className="grid grid-cols-10 gap-2">
              {primes.map((isPrime, num) => (
                num > 1 && (
                  <div
                    key={num}
                    className={`
                      w-full aspect-square flex items-center justify-center rounded-md text-sm font-medium
                      ${num === currentNumber ? 'bg-gray-600 text-white' : ''}
                      ${num === currentMultiple ? 'bg-red-500 text-white' : ''}
                      ${isPrime && num !== currentNumber && num !== currentMultiple ? 'bg-gray-500 text-white' : ''}
                      ${!isPrime && num !== currentMultiple ? 'bg-gray-400' : ''}
                      transition-colors duration-200
                    `}
                  >
                    {num}
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              <span className="text-sm">Current prime</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span className="text-sm">Current multiple being marked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
              <span className="text-sm">Prime number</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Prime Factorization Algorithm Component
const PrimeFactorizationAlgorithm: React.FC = () => {
  const [number, setNumber] = useState<number>(84);
  const [factors, setFactors] = useState<number[]>([]);
  const [currentDivisor, setCurrentDivisor] = useState<number>(-1);
  const [currentNumber, setCurrentNumber] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [steps, setSteps] = useState<Array<{divisor: number, number: number, remainder: number}>>([]);
  const animationRef = useRef<number | null>(null);

  const primeFactorization = (n: number): number[] => {
    const factors: number[] = [];
    const calculationSteps: Array<{divisor: number, number: number, remainder: number}> = [];
    let num = n;
    
    // Check for divisibility by 2
    while (num % 2 === 0) {
      factors.push(2);
      calculationSteps.push({ divisor: 2, number: num, remainder: 0 });
      num /= 2;
    }
    
    // Check for divisibility by odd numbers starting from 3
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      while (num % i === 0) {
        factors.push(i);
        calculationSteps.push({ divisor: i, number: num, remainder: 0 });
        num /= i;
      }
    }
    
    // If num is a prime number greater than 2
    if (num > 2) {
      factors.push(num);
      calculationSteps.push({ divisor: num, number: num, remainder: 0 });
    }
    
    setSteps(calculationSteps);
    return factors;
  };

  const runAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsAnimating(true);
    const result = primeFactorization(number);
    setFactors([]);
    
    let stepIndex = 0;
    let currentFactors: number[] = [];
    
    const animate = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setCurrentDivisor(step.divisor);
        setCurrentNumber(step.number);
        
        // Add the factor
        currentFactors.push(step.divisor);
        setFactors([...currentFactors]);
        
        stepIndex++;
        animationRef.current = setTimeout(animate, 1000) as unknown as number;
      } else {
        setIsAnimating(false);
        setCurrentDivisor(-1);
        setCurrentNumber(-1);
      }
    };
    
    animationRef.current = setTimeout(animate, 500) as unknown as number;
  };

  const handleCalculate = () => {
    if (!isAnimating) {
      runAnimation();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const factorizationCode = `function primeFactorization(n) {
  const factors = [];
  let num = n;
  
  // Check for divisibility by 2
  while (num % 2 === 0) {
    factors.push(2);
    num /= 2;
  }
  
  // Check for divisibility by odd numbers
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    while (num % i === 0) {
      factors.push(i);
      num /= i;
    }
  }
  
  // If num is a prime number greater than 2
  if (num > 2) {
    factors.push(num);
  }
  
  return factors;
}`;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <AlgorithmInfo
            title="Prime Factorization"
            description="Prime factorization is the process of determining which prime numbers multiply together to yield the original number. Every integer greater than 1 can be represented as a product of prime numbers in a unique way."
            timeComplexity="O(√n)"
            spaceComplexity="O(log n)"
            code={factorizationCode}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Demonstration</h3>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Number to Factorize</label>
              <input
                type="number"
                min="2"
                max="10000"
                value={number}
                onChange={(e) => setNumber(Math.max(2, parseInt(e.target.value) || 2))}
                disabled={isAnimating}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCalculate}
                disabled={isAnimating}
                className={`px-4 py-2 rounded-md font-medium ${
                  isAnimating 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gray-600 text-white hover:bg-gray-500 transition duration-200'
                }`}
              >
                Factorize
              </button>
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md mb-4 shadow">
            <h4 className="font-medium mb-2">Current State:</h4>
            {currentDivisor > 0 && (
              <p className="mb-2">
                Checking if {currentNumber} is divisible by {currentDivisor}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {factors.map((factor, index) => (
                <div
                  key={index}
                  className="bg-gray-600 text-white px-3 py-1 rounded-md font-medium animate-fadeIn"
                >
                  {factor}
                </div>
              ))}
            </div>
            
            {factors.length > 0 && (
              <p className="text-lg">
                {number} = {factors.join(' × ')}
              </p>
            )}
          </div>
          
          <div className="bg-gray-600 p-4 rounded-md shadow">
            <h4 className="font-medium mb-2">Visualization:</h4>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-500 text-white flex items-center justify-center text-xl font-bold mb-4">
                {number}
              </div>
              
              {factors.length > 0 && (
                <>
                  <div className="h-8 border-l-2 border-gray-400"></div>
                  <div className="flex flex-wrap justify-center gap-4 max-w-md">
                    {factors.map((factor, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold animate-scaleIn"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        {factor}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathematicalAlgorithms;