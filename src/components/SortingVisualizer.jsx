import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

const SortingVisualizer = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputValue, setInputValue] = useState('64, 34, 25, 12, 22, 11, 90');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [currentAlgorithmName, setCurrentAlgorithmName] = useState('');
  const [recursionInfo, setRecursionInfo] = useState(null);
  const [partitionInfo, setPartitionInfo] = useState(null);

  const algorithms = {
    bubble: 'Bubble Sort',
    selection: 'Selection Sort',
    insertion: 'Insertion Sort',
    merge: 'Merge Sort',
    quick: 'Quick Sort',
    counting: 'Counting Sort'
  };

  // Bubble Sort Implementation
  const bubbleSort = (arr) => {
    const steps = [];
    const n = arr.length;
    let tempArr = [...arr];
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...tempArr],
          comparing: [j, j + 1],
          swapping: [],
          sorted: []
        });
        
        if (tempArr[j] > tempArr[j + 1]) {
          [tempArr[j], tempArr[j + 1]] = [tempArr[j + 1], tempArr[j]];
          steps.push({
            array: [...tempArr],
            comparing: [],
            swapping: [j, j + 1],
            sorted: []
          });
        }
      }
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [],
        sorted: Array.from({length: i + 1}, (_, idx) => n - 1 - idx)
      });
    }
    
    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: n}, (_, idx) => idx)
    });
    
    return steps;
  };

  // Selection Sort Implementation
  const selectionSort = (arr) => {
    const steps = [];
    const n = arr.length;
    let tempArr = [...arr];
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...tempArr],
          comparing: [minIdx, j],
          swapping: [],
          sorted: Array.from({length: i}, (_, idx) => idx)
        });
        
        if (tempArr[j] < tempArr[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        [tempArr[i], tempArr[minIdx]] = [tempArr[minIdx], tempArr[i]];
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [i, minIdx],
          sorted: Array.from({length: i}, (_, idx) => idx)
        });
      }
      
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [],
        sorted: Array.from({length: i + 1}, (_, idx) => idx)
      });
    }
    
    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: n}, (_, idx) => idx)
    });
    
    return steps;
  };

  // Insertion Sort Implementation
  const insertionSort = (arr) => {
    const steps = [];
    const n = arr.length;
    let tempArr = [...arr];
    
    for (let i = 1; i < n; i++) {
      let key = tempArr[i];
      let j = i - 1;
      
      steps.push({
        array: [...tempArr],
        comparing: [i],
        swapping: [],
        sorted: Array.from({length: i}, (_, idx) => idx)
      });
      
      while (j >= 0 && tempArr[j] > key) {
        steps.push({
          array: [...tempArr],
          comparing: [j, j + 1],
          swapping: [],
          sorted: []
        });
        
        tempArr[j + 1] = tempArr[j];
        j = j - 1;
        
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [j + 1, j + 2],
          sorted: []
        });
      }
      
      tempArr[j + 1] = key;
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [],
        sorted: Array.from({length: i + 1}, (_, idx) => idx)
      });
    }
    
    return steps;
  };

  // Quick Sort Implementation
  const quickSort = (arr) => {
    const steps = [];
    let tempArr = [...arr];
    
    const partition = (low, high, level) => {
      const pivot = tempArr[high];
      let i = low - 1;
      
      // Show partition start
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [],
        sorted: [],
        recursionInfo: {
          type: 'partition_start',
          level: level,
          range: [low, high],
          pivot: high,
          message: `Level ${level}: Partitioning [${low}...${high}] with pivot ${pivot} (value: ${tempArr[high]})`
        }
      });
      
      for (let j = low; j <= high - 1; j++) {
        steps.push({
          array: [...tempArr],
          comparing: [j, high],
          swapping: [],
          sorted: [],
          recursionInfo: {
            type: 'partition_compare',
            level: level,
            range: [low, high],
            pivot: high,
            current: j,
            message: `Comparing ${tempArr[j]} with pivot ${tempArr[high]}`
          }
        });
        
        if (tempArr[j] < pivot) {
          i++;
          if (i !== j) {
            [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
            steps.push({
              array: [...tempArr],
              comparing: [],
              swapping: [i, j],
              sorted: [],
              recursionInfo: {
                type: 'partition_swap',
                level: level,
                range: [low, high],
                pivot: high,
                message: `Swapping ${tempArr[j]} and ${tempArr[i]} (moving smaller element left)`
              }
            });
          }
        }
      }
      
      // Place pivot in correct position
      [tempArr[i + 1], tempArr[high]] = [tempArr[high], tempArr[i + 1]];
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [i + 1, high],
        sorted: [],
        recursionInfo: {
          type: 'pivot_placement',
          level: level,
          range: [low, high],
          pivot: i + 1,
          message: `Placing pivot in final position ${i + 1}`
        }
      });
      
      // Mark pivot as in correct position
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [],
        sorted: [i + 1],
        recursionInfo: {
          type: 'partition_complete',
          level: level,
          range: [low, high],
          pivot: i + 1,
          message: `Partition complete! Pivot ${tempArr[i + 1]} is in correct position`
        }
      });
      
      return i + 1;
    };
    
    const quickSortHelper = (low, high, level = 0) => {
      if (low < high) {
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [],
          sorted: [],
          recursionInfo: {
            type: 'divide',
            level: level,
            range: [low, high],
            message: `Level ${level}: Dividing range [${low}...${high}]`
          }
        });
        
        const pi = partition(low, high, level);
        
        // Recursively sort left part
        if (low < pi - 1) {
          steps.push({
            array: [...tempArr],
            comparing: [],
            swapping: [],
            sorted: [],
            recursionInfo: {
              type: 'recurse_left',
              level: level + 1,
              range: [low, pi - 1],
              message: `Level ${level + 1}: Sorting left part [${low}...${pi - 1}]`
            }
          });
          quickSortHelper(low, pi - 1, level + 1);
        }
        
        // Recursively sort right part
        if (pi + 1 < high) {
          steps.push({
            array: [...tempArr],
            comparing: [],
            swapping: [],
            sorted: [],
            recursionInfo: {
              type: 'recurse_right',
              level: level + 1,
              range: [pi + 1, high],
              message: `Level ${level + 1}: Sorting right part [${pi + 1}...${high}]`
            }
          });
          quickSortHelper(pi + 1, high, level + 1);
        }
        
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [],
          sorted: [],
          recursionInfo: {
            type: 'conquer_complete',
            level: level,
            range: [low, high],
            message: `Level ${level}: Range [${low}...${high}] is now sorted`
          }
        });
      }
    };
    
    quickSortHelper(0, arr.length - 1, 0);
    
    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: arr.length}, (_, idx) => idx),
      recursionInfo: {
        type: 'complete',
        level: 0,
        message: 'Quick Sort Complete!'
      }
    });
    
    return steps;
  };

  // Merge Sort Implementation
  const mergeSort = (arr) => {
    const steps = [];
    let tempArr = [...arr];
    
    const merge = (left, mid, right, level) => {
      const n1 = mid - left + 1;
      const n2 = right - mid;
      const L = new Array(n1);
      const R = new Array(n2);
      
      // Copy data to temp arrays
      for (let i = 0; i < n1; i++) L[i] = tempArr[left + i];
      for (let j = 0; j < n2; j++) R[j] = tempArr[mid + 1 + j];
      
      // Show merge start
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [],
        sorted: [],
        recursionInfo: {
          type: 'merge_start',
          level: level,
          leftRange: [left, mid],
          rightRange: [mid + 1, right],
          message: `Level ${level}: Merging [${left}...${mid}] and [${mid + 1}...${right}]`
        }
      });
      
      let i = 0, j = 0, k = left;
      
      // Merge the temp arrays back into arr[left..right]
      while (i < n1 && j < n2) {
        const leftVal = L[i];
        const rightVal = R[j];
        
        steps.push({
          array: [...tempArr],
          comparing: [left + i, mid + 1 + j],
          swapping: [],
          sorted: [],
          recursionInfo: {
            type: 'merge_compare',
            level: level,
            leftRange: [left, mid],
            rightRange: [mid + 1, right],
            message: `Comparing ${leftVal} and ${rightVal}`
          }
        });
        
        if (leftVal <= rightVal) {
          tempArr[k] = leftVal;
          i++;
        } else {
          tempArr[k] = rightVal;
          j++;
        }
        
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [k],
          sorted: [],
          recursionInfo: {
            type: 'merge_place',
            level: level,
            leftRange: [left, mid],
            rightRange: [mid + 1, right],
            message: `Placing ${tempArr[k]} at position ${k}`
          }
        });
        k++;
      }
      
      // Copy remaining elements of L[]
      while (i < n1) {
        tempArr[k] = L[i];
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [k],
          sorted: [],
          recursionInfo: {
            type: 'merge_remaining',
            level: level,
            message: `Copying remaining element ${L[i]} from left array`
          }
        });
        i++;
        k++;
      }
      
      // Copy remaining elements of R[]
      while (j < n2) {
        tempArr[k] = R[j];
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [k],
          sorted: [],
          recursionInfo: {
            type: 'merge_remaining',
            level: level,
            message: `Copying remaining element ${R[j]} from right array`
          }
        });
        j++;
        k++;
      }
      
      // Show merge complete
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [],
        sorted: Array.from({length: right - left + 1}, (_, idx) => left + idx),
        recursionInfo: {
          type: 'merge_complete',
          level: level,
          range: [left, right],
          message: `Level ${level}: Merge complete for range [${left}...${right}]`
        }
      });
    };
    
    const mergeSortHelper = (left, right, level = 0) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Show divide step
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [],
          sorted: [],
          recursionInfo: {
            type: 'divide',
            level: level,
            range: [left, right],
            mid: mid,
            leftRange: [left, mid],
            rightRange: [mid + 1, right],
            message: `Level ${level}: Dividing [${left}...${right}] into [${left}...${mid}] and [${mid + 1}...${right}]`
          }
        });
        
        // Sort first half
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [],
          sorted: [],
          recursionInfo: {
            type: 'recurse_left',
            level: level + 1,
            range: [left, mid],
            message: `Level ${level + 1}: Sorting left half [${left}...${mid}]`
          }
        });
        mergeSortHelper(left, mid, level + 1);
        
        // Sort second half
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [],
          sorted: [],
          recursionInfo: {
            type: 'recurse_right',
            level: level + 1,
            range: [mid + 1, right],
            message: `Level ${level + 1}: Sorting right half [${mid + 1}...${right}]`
          }
        });
        mergeSortHelper(mid + 1, right, level + 1);
        
        // Merge the sorted halves
        merge(left, mid, right, level);
      } else {
        // Base case - single element is already sorted
        steps.push({
          array: [...tempArr],
          comparing: [],
          swapping: [],
          sorted: [left],
          recursionInfo: {
            type: 'base_case',
            level: level,
            range: [left, right],
            message: `Level ${level}: Base case - single element at index ${left} is sorted`
          }
        });
      }
    };
    
    mergeSortHelper(0, arr.length - 1, 0);
    
    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: arr.length}, (_, idx) => idx),
      recursionInfo: {
        type: 'complete',
        level: 0,
        message: 'Merge Sort Complete!'
      }
    });
    
    return steps;
  };

  // Counting Sort Implementation
  const countingSort = (arr) => {
    const steps = [];
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    let tempArr = [...arr];
    
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      steps.push({
        array: [...tempArr],
        comparing: [i],
        swapping: [],
        sorted: []
      });
    }
    
    // Modify count array
    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
    }
    
    // Build output array
    const output = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i]] - 1] = arr[i];
      count[arr[i]]--;
      
      for (let j = 0; j < output.length; j++) {
        if (output[j] !== undefined) {
          tempArr[j] = output[j];
        }
      }
      
      steps.push({
        array: [...tempArr],
        comparing: [],
        swapping: [count[arr[i]]],
        sorted: []
      });
    }
    
    steps.push({
      array: [...tempArr],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: arr.length}, (_, idx) => idx)
    });
    
    return steps;
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleArraySubmit = () => {
    try {
      const newArray = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (newArray.length > 0) {
        setArray(newArray);
        resetAnimation();
      }
    } catch (error) {
      alert('Please enter valid numbers separated by commas');
    }
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setRecursionInfo(null);
    setPartitionInfo(null);
  };

  const startSorting = () => {
    if (isAnimating) {
      setIsAnimating(false);
      return;
    }

    let steps = [];
    setCurrentAlgorithmName(algorithms[selectedAlgorithm]);
    
    switch (selectedAlgorithm) {
      case 'bubble':
        steps = bubbleSort(array);
        break;
      case 'selection':
        steps = selectionSort(array);
        break;
      case 'insertion':
        steps = insertionSort(array);
        break;
      case 'merge':
        steps = mergeSort(array);
        break;
      case 'quick':
        steps = quickSort(array);
        break;
      case 'counting':
        steps = countingSort(array);
        break;
      default:
        steps = bubbleSort(array);
    }
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating && animationSteps.length > 0) {
      const timer = setTimeout(() => {
        if (currentStep < animationSteps.length) {
          const step = animationSteps[currentStep];
          setArray(step.array);
          setComparingIndices(step.comparing || []);
          setSwappingIndices(step.swapping || []);
          setSortedIndices(step.sorted || []);
          setRecursionInfo(step.recursionInfo || null);
          setPartitionInfo(step.partitionInfo || null);
          setCurrentStep(currentStep + 1);
        } else {
          setIsAnimating(false);
        }
      }, animationSpeed);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, animationSteps, animationSpeed]);

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (swappingIndices.includes(index)) return 'bg-red-500';
    if (comparingIndices.includes(index)) return 'bg-yellow-500';
    
    // Special coloring for merge sort and quick sort
    if (recursionInfo) {
      if (selectedAlgorithm === 'merge') {
        if (recursionInfo.leftRange && index >= recursionInfo.leftRange[0] && index <= recursionInfo.leftRange[1]) {
          return 'bg-purple-500';
        }
        if (recursionInfo.rightRange && index >= recursionInfo.rightRange[0] && index <= recursionInfo.rightRange[1]) {
          return 'bg-orange-500';
        }
      }
      
      if (selectedAlgorithm === 'quick') {
        if (recursionInfo.pivot !== undefined && index === recursionInfo.pivot) {
          return 'bg-pink-500';
        }
        if (recursionInfo.range && index >= recursionInfo.range[0] && index <= recursionInfo.range[1]) {
          return 'bg-cyan-500';
        }
      }
    }
    
    return 'bg-blue-500';
  };

  const maxValue = Math.max(...array);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sorting Algorithm Visualizer</h1>
          <p className="text-slate-300">Watch how different sorting algorithms work step by step</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Array Input */}
            <div>
              <label className="block text-slate-300 text-sm mb-2">Array Input</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="64, 34, 25, 12, 22, 11, 90"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                disabled={isAnimating}
              />
            </div>

            {/* Algorithm Selection */}
            <div>
              <label className="block text-slate-300 text-sm mb-2">Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                disabled={isAnimating}
              >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort</option>
                <option value="counting">Counting Sort</option>
              </select>
            </div>

            {/* Speed Control */}
            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Speed: {1000 - animationSpeed}ms
              </label>
              <input
                type="range"
                min="100"
                max="900"
                value={1000 - animationSpeed}
                onChange={(e) => setAnimationSpeed(1000 - parseInt(e.target.value))}
                className="w-full"
                disabled={isAnimating}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleArraySubmit}
                disabled={isAnimating}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Settings size={16} />
                Set Array
              </button>
              <button
                onClick={startSorting}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                {isAnimating ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetAnimation}
                disabled={isAnimating}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        {currentAlgorithmName && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-2">Currently Running: {currentAlgorithmName}</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-slate-300">Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-slate-300">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-slate-300">Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-slate-300">Sorted</span>
              </div>
              {(selectedAlgorithm === 'merge' || selectedAlgorithm === 'quick') && (
                <>
                  {selectedAlgorithm === 'merge' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-slate-300">Left Half</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-slate-300">Right Half</span>
                      </div>
                    </>
                  )}
                  {selectedAlgorithm === 'quick' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-pink-500 rounded"></div>
                        <span className="text-slate-300">Pivot</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                        <span className="text-slate-300">Current Range</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Recursion Information for Merge Sort and Quick Sort */}
        {recursionInfo && (selectedAlgorithm === 'merge' || selectedAlgorithm === 'quick') && (
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedAlgorithm === 'merge' ? 'Merge Sort' : 'Quick Sort'} - Recursion Tree
              </h3>
              <div className="text-sm text-slate-300">
                Recursion Level: {recursionInfo.level}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium text-slate-200 mb-2">Current Operation:</div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-white font-mono text-sm">{recursionInfo.message}</div>
              </div>
            </div>
            
            {/* Visual representation of recursion tree */}
            <div className="mt-4">
              <div className="text-sm font-medium text-slate-200 mb-2">Recursion Tree Visualization:</div>
              <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                <div style={{ paddingLeft: `${recursionInfo.level * 30}px` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xs text-slate-400">Level {recursionInfo.level}:</div>
                    <div className="flex items-center gap-1">
                      {recursionInfo.type === 'divide' && (
                        <>
                          <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            [{recursionInfo.range ? recursionInfo.range.join('...') : ''}]
                          </div>
                          <span className="text-slate-300 text-xs">→</span>
                          {recursionInfo.leftRange && (
                            <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                              [{recursionInfo.leftRange.join('...')}]
                            </div>
                          )}
                          {recursionInfo.rightRange && (
                            <>
                              <span className="text-slate-300 text-xs">+</span>
                              <div className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                                [{recursionInfo.rightRange.join('...')}]
                              </div>
                            </>
                          )}
                        </>
                      )}
                      
                      {recursionInfo.type === 'merge_start' && (
                        <>
                          <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                            [{recursionInfo.leftRange.join('...')}]
                          </div>
                          <span className="text-slate-300 text-xs">+</span>
                          <div className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                            [{recursionInfo.rightRange.join('...')}]
                          </div>
                          <span className="text-slate-300 text-xs">→ MERGE</span>
                        </>
                      )}
                      
                      {recursionInfo.type === 'partition_start' && (
                        <>
                          <div className="px-2 py-1 bg-cyan-600 text-white text-xs rounded">
                            [{recursionInfo.range.join('...')}]
                          </div>
                          <span className="text-slate-300 text-xs">→ PARTITION</span>
                          <div className="px-2 py-1 bg-pink-600 text-white text-xs rounded">
                            Pivot: {recursionInfo.pivot}
                          </div>
                        </>
                      )}
                      
                      {(recursionInfo.type === 'base_case' || recursionInfo.type === 'complete') && (
                        <div className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                          {recursionInfo.type === 'base_case' ? 'BASE CASE' : 'COMPLETE'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Show phase indicator */}
                  <div className="text-xs text-slate-400 mt-1">
                    Phase: {
                      recursionInfo.type.includes('divide') || recursionInfo.type.includes('recurse') ? 'DIVIDE' :
                      recursionInfo.type.includes('merge') || recursionInfo.type.includes('partition') ? 'CONQUER' :
                      recursionInfo.type === 'complete' ? 'COMPLETE' : 'PROCESS'
                    }
                  </div>
                </div>
              </div>
            </div>
            
            {/* Algorithm-specific details */}
            {selectedAlgorithm === 'merge' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="text-xs font-medium text-purple-300 mb-1">Left Subarray</div>
                  <div className="text-white text-sm">
                    {recursionInfo.leftRange ? `[${recursionInfo.leftRange[0]}...${recursionInfo.leftRange[1]}]` : 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="text-xs font-medium text-orange-300 mb-1">Right Subarray</div>
                  <div className="text-white text-sm">
                    {recursionInfo.rightRange ? `[${recursionInfo.rightRange[0]}...${recursionInfo.rightRange[1]}]` : 'N/A'}
                  </div>
                </div>
              </div>
            )}
            
            {selectedAlgorithm === 'quick' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="text-xs font-medium text-cyan-300 mb-1">Current Range</div>
                  <div className="text-white text-sm">
                    {recursionInfo.range ? `[${recursionInfo.range[0]}...${recursionInfo.range[1]}]` : 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="text-xs font-medium text-pink-300 mb-1">Pivot Index</div>
                  <div className="text-white text-sm">
                    {recursionInfo.pivot !== undefined ? recursionInfo.pivot : 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="text-xs font-medium text-yellow-300 mb-1">Pivot Value</div>
                  <div className="text-white text-sm">
                    {recursionInfo.pivot !== undefined ? array[recursionInfo.pivot] : 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Visualization */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex items-end justify-center gap-2 min-h-[300px]" style={{ height: '400px' }}>
            {array.map((value, index) => (
              <div key={`${index}-${value}`} className="flex flex-col items-center gap-2">
                <div
                  className={`${getBarColor(index)} transition-all duration-300 rounded-t-lg min-w-[30px] flex items-end justify-center text-white text-sm font-semibold shadow-lg`}
                  style={{
                    height: `${(value / maxValue) * 300}px`,
                    width: `${Math.max(30, 400 / array.length)}px`
                  }}
                >
                  <span className="mb-2">{value}</span>
                </div>
                <div className="text-slate-400 text-xs">{index}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        {animationSteps.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mt-6 border border-slate-700">
            <div className="flex justify-between text-slate-300 text-sm mb-2">
              <span>Progress</span>
              <span>{currentStep} / {animationSteps.length} steps</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / animationSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingVisualizer;