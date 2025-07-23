import React, { useState, useRef, useEffect } from 'react';
import { Play, Sparkles } from 'lucide-react';

interface ReelState {
  isSpinning: boolean;
  currentNumber: number;
  finalNumber: number;
}

function App() {
  const [balance, setBalance] = useState<number>(100);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [reels, setReels] = useState<ReelState[]>([
    { isSpinning: false, currentNumber: 1, finalNumber: 1 },
    { isSpinning: false, currentNumber: 1, finalNumber: 1 },
    { isSpinning: false, currentNumber: 1, finalNumber: 1 }
  ]);

  const spinCost = 10;
  const canSpin = balance >= spinCost && !isSpinning;

  const generateRandomNumber = (): number => Math.floor(Math.random() * 9) + 1;

  const handleSpin = () => {
    if (!canSpin) return;

    setBalance(prev => prev - spinCost);
    setIsSpinning(true);
    setMessage('');

    // Generate final numbers for all reels
    const finalNumbers = [generateRandomNumber(), generateRandomNumber(), generateRandomNumber()];
    
    // Start spinning animation for all reels
    setReels(prev => prev.map((reel, index) => ({
      ...reel,
      isSpinning: true,
      finalNumber: finalNumbers[index]
    })));

    // Stop spinning after 3 seconds
    setTimeout(() => {
      setReels(prev => prev.map((reel, index) => ({
        ...reel,
        isSpinning: false,
        currentNumber: finalNumbers[index]
      })));

      // Check for win condition
      const allSame = finalNumbers.every(num => num === finalNumbers[0]);
      if (allSame) {
        setBalance(prev => prev + 10);
        setMessage('Поздравляем! Вы выиграли!');
      }

      setIsSpinning(false);
    }, 3000);
  };

  const isGameOver = balance < spinCost && !isSpinning;

  useEffect(() => {
    if (isGameOver) {
      setMessage('Вы проиграли');
    }
  }, [isGameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Lights */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute animate-pulse top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full blur-sm"></div>
        <div className="absolute animate-pulse top-20 right-20 w-3 h-3 bg-pink-400 rounded-full blur-sm animation-delay-1000"></div>
        <div className="absolute animate-pulse bottom-20 left-20 w-5 h-5 bg-green-400 rounded-full blur-sm animation-delay-2000"></div>
        <div className="absolute animate-pulse bottom-10 right-10 w-4 h-4 bg-blue-400 rounded-full blur-sm animation-delay-3000"></div>
        <div className="absolute animate-pulse top-1/2 left-5 w-3 h-3 bg-purple-400 rounded-full blur-sm animation-delay-4000"></div>
        <div className="absolute animate-pulse top-1/3 right-5 w-4 h-4 bg-orange-400 rounded-full blur-sm animation-delay-5000"></div>
      </div>

      <div className="relative">
        {/* Main Slot Machine Container */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="text-yellow-500" />
                Поле чудес
                <Sparkles className="text-yellow-500" />
              </h1>
              <div className="text-2xl font-semibold text-gray-700">
                Баланс: <span className="text-green-600">{balance}</span> баллов
              </div>
            </div>

            {/* Slot Machine Reels */}
            <div className="flex justify-center gap-4 mb-8">
              {reels.map((reel, index) => (
                <SlotReel 
                  key={index} 
                  isSpinning={reel.isSpinning} 
                  currentNumber={reel.currentNumber}
                  finalNumber={reel.finalNumber}
                />
              ))}
            </div>

            {/* Message Display */}
            <div className="text-center mb-6 h-8">
              {message && (
                <div className={`text-xl font-bold ${
                  message.includes('выиграли') ? 'text-green-600' : 'text-red-600'
                } animate-pulse`}>
                  {message}
                </div>
              )}
            </div>

            {/* Spin Button */}
            <div className="text-center">
              <button
                onClick={handleSpin}
                disabled={!canSpin || isGameOver}
                className={`
                  px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 transform
                  ${canSpin && !isGameOver
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }
                  flex items-center gap-2 mx-auto
                `}
              >
                <Play className={isSpinning ? 'animate-spin' : ''} size={24} />
                {isSpinning ? 'Крутится...' : 'Крутить (10 баллов)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SlotReelProps {
  isSpinning: boolean;
  currentNumber: number;
  finalNumber: number;
}

function SlotReel({ isSpinning, currentNumber, finalNumber }: SlotReelProps) {
  const [displayNumber, setDisplayNumber] = useState<number>(currentNumber);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSpinning) {
      // Start rapid number changes
      intervalRef.current = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 9) + 1);
      }, 100);
    } else {
      // Stop spinning and show final number
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayNumber(finalNumber);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSpinning, finalNumber]);

  return (
    <div className="relative">
      {/* Reel Container */}
      <div className="w-24 h-32 bg-white/30 backdrop-blur-sm rounded-2xl border-4 border-white/50 shadow-xl overflow-hidden relative">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
        
        {/* Number Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`
            text-6xl font-bold text-gray-800 transition-all duration-100
            ${isSpinning ? 'animate-bounce blur-sm' : 'blur-none'}
          `}>
            {displayNumber}
          </div>
        </div>

        {/* Spinning Effect Overlay */}
        {isSpinning && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-pulse"></div>
        )}
      </div>

      {/* Reel Shadow */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-md"></div>
    </div>
  );
}

export default App;