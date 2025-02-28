import { useState, useEffect, useCallback } from 'react'
import './App.css'

// Define our game-specific types
interface GameState {
  targetNumber: number;
  guess: string;
  score: number;
  timeLeft: number;
  gameActive: boolean;
  feedback: string;
  highScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  numbersToShow: number[];
  currentNumberIndex: number;
  gameSettings: {
    numbersCount: number;
    operations: 'addition' | 'subtraction' | 'both';
    displayTimePerNumber: number;
  };
  showingNumber: boolean;
}

function App() {
  // Initialize game state with proper typing
  const [gameState, setGameState] = useState<GameState>({
    targetNumber: 0,
    guess: '',
    score: 0,
    timeLeft: 30, // Increased time for calculation
    gameActive: false,
    feedback: 'Ready to play?',
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    difficulty: 'medium',
    numbersToShow: [],
    currentNumberIndex: -1,
    gameSettings: {
      numbersCount: 3,
      operations: 'addition',
      displayTimePerNumber: 1000, // 1 second per number
    },
    showingNumber: false
  });

  // Timer effect for countdown
  useEffect(() => {
    let timer: number | undefined;

    if (gameState.gameActive && gameState.timeLeft > 0) {
      timer = window.setInterval(() => {
        setGameState(prevState => ({
          ...prevState,
          timeLeft: prevState.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.gameActive) {
      endGame();
    }

    // Clean up timer on component unmount or when game stops
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.gameActive, gameState.timeLeft]);

  // Generate a random number based on difficulty
  const generateTargetNumber = useCallback(() => {
    const ranges = {
      easy: 10,
      medium: 100,
      hard: 1000
    };
    return Math.floor(Math.random() * ranges[gameState.difficulty]) + 1;
  }, [gameState.difficulty]);

  // Generate a sequence of numbers based on game settings
  const generateNumberSequence = useCallback(() => {
    const { numbersCount, operations } = gameState.gameSettings;
    const numbers: number[] = [];
    let total = 0;

    for (let i = 0; i < numbersCount; i++) {
      let num: number;
      let operation: '+' | '-' = '+';

      if (operations === 'both') {
        operation = Math.random() > 0.5 ? '+' : '-';
      } else if (operations === 'subtraction') {
        operation = '-';
      }

      // Generate appropriate numbers based on difficulty
      const max = {
        easy: 5,
        medium: 15,
        hard: 30
      }[gameState.difficulty];

      num = Math.floor(Math.random() * max) + 1;

      // Store number with operation
      numbers.push(operation === '+' ? num : -num);
      total += operation === '+' ? num : -num;
    }

    return { numbers, total: Math.abs(total) };
  }, [gameState.difficulty, gameState.gameSettings]);

  // Effect for showing numbers sequentially
  useEffect(() => {
    let timer: number | undefined;

    if (gameState.gameActive && gameState.currentNumberIndex >= 0) {
      timer = window.setInterval(() => {
        setGameState(prevState => {
          if (prevState.currentNumberIndex >= prevState.numbersToShow.length) {
            return { ...prevState, showingNumber: false };
          }
          return {
            ...prevState,
            showingNumber: !prevState.showingNumber,
            currentNumberIndex: prevState.showingNumber
              ? prevState.currentNumberIndex + 1
              : prevState.currentNumberIndex
          };
        });
      }, gameState.gameSettings.displayTimePerNumber / 2);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.gameActive, gameState.currentNumberIndex]);

  // Start a new game
  const startGame = () => {
    const { numbers, total } = generateNumberSequence();
    setGameState(prevState => ({
      ...prevState,
      targetNumber: total,
      timeLeft: 30,
      gameActive: true,
      guess: '',
      feedback: 'Watch the numbers carefully and add them up!',
      numbersToShow: numbers,
      currentNumberIndex: 0,
      showingNumber: true,
      score: 0 // Reset score at game start
    }));
  };

  // End the current game and update high score if needed
  const endGame = () => {
    const newHighScore = Math.max(gameState.score, gameState.highScore);

    // Save high score to localStorage
    localStorage.setItem('highScore', newHighScore.toString());

    setGameState(prevState => ({
      ...prevState,
      gameActive: false,
      feedback: `Game over! Your score: ${prevState.score}`,
      highScore: newHighScore
    }));
  };

  // Handle user input for number guessing
  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setGameState(prevState => ({
        ...prevState,
        guess: value
      }));
    }
  };

  // Submit a guess
  const submitGuess = () => {
    if (!gameState.gameActive || !gameState.guess) return;

    const userGuess = parseInt(gameState.guess);
    const targetTotal = gameState.numbersToShow.reduce((sum, num) => sum + num, 0);
    const correct = userGuess === Math.abs(targetTotal);

    let feedback;
    let scoreChange = 0;

    if (correct) {
      feedback = 'Correct! Get ready for the next sequence!';
      scoreChange = 10;

      // Add bonus points based on time left and difficulty
      const timeBonus = gameState.timeLeft;
      const difficultyBonus = {
        easy: 1,
        medium: 2,
        hard: 3
      }[gameState.difficulty];

      scoreChange += timeBonus * difficultyBonus;

      // Start next sequence
      const { numbers, total } = generateNumberSequence();
      setGameState(prevState => ({
        ...prevState,
        score: prevState.score + scoreChange,
        feedback,
        numbersToShow: numbers,
        targetNumber: total,
        currentNumberIndex: 0,
        showingNumber: true,
        guess: '',
        timeLeft: Math.max(prevState.timeLeft, 15) // Keep current time or reset to minimum 15 seconds
      }));
    } else {
      const difference = Math.abs(userGuess - Math.abs(targetTotal));
      if (difference <= 5) {
        feedback = `Very close! The total was ${Math.abs(targetTotal)}`;
        scoreChange = 2;
      } else if (difference <= 10) {
        feedback = `Getting warmer! The total was ${Math.abs(targetTotal)}`;
        scoreChange = 1;
      } else {
        feedback = `Wrong! The total was ${Math.abs(targetTotal)}`;
      }

      // End game on wrong answer
      setGameState(prevState => ({
        ...prevState,
        score: prevState.score + scoreChange,
        feedback,
        gameActive: false
      }));
    }
  };

  // Change difficulty level
  const changeDifficulty = (difficulty: GameState['difficulty']) => {
    setGameState(prevState => ({
      ...prevState,
      difficulty,
      feedback: `Difficulty set to ${difficulty}`,
      gameActive: false
    }));
  };

  // Update game settings
  const updateGameSettings = (updates: Partial<GameState['gameSettings']>) => {
    setGameState(prevState => ({
      ...prevState,
      gameSettings: { ...prevState.gameSettings, ...updates }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
      <div className="game-container bg-gray-900/80 backdrop-blur">
        <h1 className="text-4xl font-heading font-bold text-center mb-8 text-main-orange-400">
          Count Those Numbers!
        </h1>

        {!gameState.gameActive && (
          <div className="mb-8">
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Numbers to Show:</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={gameState.gameSettings.numbersCount}
                  onChange={(e) => updateGameSettings({ numbersCount: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Operations:</label>
                <select
                  value={gameState.gameSettings.operations}
                  onChange={(e) => updateGameSettings({
                    operations: e.target.value as GameState['gameSettings']['operations']
                  })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
                >
                  <option value="addition">Addition Only</option>
                  <option value="subtraction">Subtraction Only</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Time (seconds):</label>
                <input
                  type="number"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={gameState.gameSettings.displayTimePerNumber / 1000}
                  onChange={(e) => updateGameSettings({
                    displayTimePerNumber: Number(e.target.value) * 1000
                  })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded ${gameState.difficulty === 'easy' ? 'bg-main-orange-500' : 'bg-gray-700'}`}
            onClick={() => changeDifficulty('easy')}
          >
            Easy (1-10)
          </button>
          <button
            className={`px-4 py-2 rounded ${gameState.difficulty === 'medium' ? 'bg-main-orange-500' : 'bg-gray-700'}`}
            onClick={() => changeDifficulty('medium')}
          >
            Medium (1-100)
          </button>
          <button
            className={`px-4 py-2 rounded ${gameState.difficulty === 'hard' ? 'bg-main-orange-500' : 'bg-gray-700'}`}
            onClick={() => changeDifficulty('hard')}
          >
            Hard (1-1000)
          </button>
        </div>

        <div className="flex justify-between mb-8">
          <div className="text-lg">
            <span className="font-bold">Score:</span> {gameState.score}
          </div>
          <div className="text-lg">
            <span className="font-bold">High Score:</span> {gameState.highScore}
          </div>
          <div className={`text-lg font-bold ${gameState.timeLeft <= 3 ? 'text-support-error' : 'text-support-info'}`}>
            Time: {gameState.timeLeft}s
          </div>
        </div>

        {gameState.gameActive ? (
          <div className="text-center">
            <div className="number-display text-8xl font-bold mb-8">
              {gameState.showingNumber && gameState.currentNumberIndex < gameState.numbersToShow.length
                ? (gameState.numbersToShow[gameState.currentNumberIndex] > 0 ? '+' : '') +
                  gameState.numbersToShow[gameState.currentNumberIndex]
                : '?'}
            </div>
            {gameState.currentNumberIndex >= gameState.numbersToShow.length && (
              <>
                <div className="mb-6">
                  <input
                    type="text"
                    value={gameState.guess}
                    onChange={handleGuessChange}
                    placeholder="What's the total?"
                    className="px-4 py-2 rounded-md bg-gray-700 text-white border-2 border-gray-600 focus:border-main-orange-400 focus:outline-none w-full max-w-xs"
                    autoFocus
                  />
                </div>
                <button
                  onClick={submitGuess}
                  disabled={!gameState.guess}
                  className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center">
            <button onClick={startGame} className="button-primary">
              Start Game
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-xl">
          <div className={`
            p-4 rounded-md
            ${gameState.feedback.includes('Correct') ? 'bg-green-900/30 text-support-success' :
              gameState.feedback.includes('close') ? 'bg-yellow-900/30 text-support-warning' :
              gameState.feedback.includes('Game over') ? 'bg-red-900/30 text-support-error' :
              'bg-blue-900/30 text-support-info'}
          `}>
            {gameState.feedback}
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Guess the correct number to score points!</p>
          <p>You get 10 points for each correct guess plus bonus points for remaining time.</p>
        </div>
      </div>
    </div>
  )
}

export default App
