
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from "@/lib/auth";
import { useScores } from "@/lib/scores";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInterval } from "../snake/useInterval";
import { Audio } from "./audio";
import {
  Play,
  Pause,
  RefreshCw,
  ArrowLeft, 
  ArrowRight,
  ArrowDown,
  ArrowUp,
  RotateCcw
} from "lucide-react";

// TETROMINOS SHAPES
const TETROMINOS = {
  0: { shape: [[0]], color: '0, 0, 0' },
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0]
    ],
    color: '80, 227, 230', // cyan
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0]
    ],
    color: '36, 95, 223', // blue
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L']
    ],
    color: '223, 173, 36', // orange
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O'],
    ],
    color: '223, 217, 36', // yellow
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0]
    ],
    color: '48, 211, 56', // green
  },
  T: {
    shape: [
      [0, 0, 0],
      ['T', 'T', 'T'],
      [0, 'T', 0]
    ],
    color: '132, 61, 198', // purple
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0]
    ],
    color: '227, 78, 78', // red
  }
};

// Random Tetromino generator
const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

// GAME CONSTANTS
const STAGE_WIDTH = 12;
const STAGE_HEIGHT = 20;
const ROWPOINTS = [40, 100, 300, 1200]; // Points for 1, 2, 3, 4 rows
const DROPTIME = 1000; // Initial drop time

// Create empty stage - 2D array filled with zeros
const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  );

// Check if tetromino collides with boundaries or existing blocks
const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[0].length; x += 1) {
      // 1. Check that we're on a tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if (
          // 2. Check movement is inside the game area height (y)
          !stage[y + player.pos.y + moveY] ||
          // 3. Check movement is inside the game area width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check if cell we're moving to isn't clear
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export function TetrisGame() {
  const { isAuthenticated, user } = useAuth();
  const { addScore } = useScores();
  const isMobile = useIsMobile();
  
  // Game states
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [stage, setStage] = useState(createStage());
  const [nextTetromino, setNextTetromino] = useState(null);
  
  // Player state - with tetromino, position and collision detection
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  // Refs
  const canvasRef = useRef(null);
  const audioRef = useRef(new Audio());

  // Effect to load high score from local storage
  useEffect(() => {
    const storedHighScore = localStorage.getItem('tetrisHighScore') || 0;
    setHighScore(Number(storedHighScore));
  }, []);

  // Prevent scrolling when game is active
  useEffect(() => {
    if (gameStarted) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [gameStarted]);

  // Update stage (playing field)
  const updateStage = useCallback(prevStage => {
    // First flush the stage
    const newStage = prevStage.map(row =>
      row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
    );

    // Then draw the tetromino
    if (player.tetromino) {
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });
    }
    
    // Check if we collided
    if (player.collided) {
      resetPlayer();
      return sweepRows(newStage);
    }
    
    return newStage;
  }, [player]);

  // Update stage on player movement
  useEffect(() => {
    if (!gameOver && gameStarted && !isPaused) {
      setStage(prev => updateStage(prev));
    }
  }, [player, updateStage, gameOver, gameStarted, isPaused]);

  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / STAGE_WIDTH;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#333';
    
    // Horizontal lines
    for (let y = 0; y <= STAGE_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvas.width, y * cellSize);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x <= STAGE_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvas.height);
      ctx.stroke();
    }

    // Draw filled cells
    stage.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell[0] !== 0) {
          const tetroType = cell[0];
          const color = TETROMINOS[tetroType].color;
          
          ctx.fillStyle = `rgba(${color}, 1)`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Border for the cell
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });
  }, [stage]);

  // Draw preview tetromino
  const drawPreviewTetromino = useCallback(() => {
    if (!nextTetromino || !canvasRef.current) return;
    
    const previewCanvas = document.getElementById('preview-canvas');
    if (!previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    const cellSize = previewCanvas.width / 6; // Smaller cells for preview
    
    // Clear canvas
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    const tetro = nextTetromino;
    
    // Calculate center position
    const offsetX = (6 - tetro.shape[0].length) / 2;
    const offsetY = (6 - tetro.shape.length) / 2;
    
    // Draw tetromino
    tetro.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = `rgba(${tetro.color}, 1)`;
          ctx.fillRect(
            (x + offsetX) * cellSize, 
            (y + offsetY) * cellSize, 
            cellSize, 
            cellSize
          );
          
          // Border for the cell
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            (x + offsetX) * cellSize, 
            (y + offsetY) * cellSize, 
            cellSize, 
            cellSize
          );
        }
      });
    });
  }, [nextTetromino]);

  useEffect(() => {
    drawPreviewTetromino();
  }, [nextTetromino, drawPreviewTetromino]);

  // Reset player position and generate new tetromino
  const resetPlayer = useCallback(() => {
    let newTetromino;
    
    if (nextTetromino) {
      newTetromino = nextTetromino;
    } else {
      newTetromino = randomTetromino();
    }
    
    // Generate next tetromino
    setNextTetromino(randomTetromino());
    
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: newTetromino.shape,
      collided: false,
    });
    
    // Check if game over (collision immediately after reset)
    if (checkCollision(
      { pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, tetromino: newTetromino.shape, collided: false },
      stage,
      { x: 0, y: 0 }
    )) {
      handleGameOver();
    }
  }, [nextTetromino, stage]);

  // Check for completed rows and clear them
  const sweepRows = useCallback((newStage) => {
    let rowsCleared = 0;
    
    const stage = newStage.reduce((acc, row) => {
      // If no cell in the row has a 0, it means the row is full
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        rowsCleared += 1;
        // Add empty row at the beginning
        acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
        return acc;
      }
      acc.push(row);
      return acc;
    }, []);
    
    if (rowsCleared > 0) {
      // Play sound
      audioRef.current.playLineClear();
      
      // Update score
      setRows(prev => prev + rowsCleared);
      setScore(prev => prev + ROWPOINTS[rowsCleared - 1] * level);
    }
    
    return stage;
  }, [level]);

  // Move tetromino left or right
  const movePlayer = useCallback((dir) => {
    if (!gameStarted || isPaused || gameOver) return;
    
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x + dir, y: prev.pos.y }
      }));
      audioRef.current.playMove();
    }
  }, [checkCollision, gameStarted, isPaused, gameOver, player, stage]);
  
  // Drop tetromino one row
  const dropPlayer = useCallback(() => {
    if (!gameStarted || isPaused || gameOver) return;
    
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x, y: prev.pos.y + 1 }
      }));
    } else {
      // Game over check
      if (player.pos.y < 1) {
        handleGameOver();
        return;
      }
      
      // Merge tetromino with stage
      setPlayer(prev => ({
        ...prev,
        collided: true
      }));
      audioRef.current.playLand();
    }
  }, [checkCollision, gameStarted, isPaused, gameOver, player, stage]);
  
  // Hard drop - tetromino falls to bottom instantly
  const hardDrop = useCallback(() => {
    if (!gameStarted || isPaused || gameOver) return;
    
    let dropDistance = 0;
    while (!checkCollision(player, stage, { x: 0, y: dropDistance + 1 })) {
      dropDistance++;
    }
    
    setPlayer(prev => ({
      ...prev,
      pos: { x: prev.pos.x, y: prev.pos.y + dropDistance },
      collided: true
    }));
    
    audioRef.current.playHardDrop();
  }, [checkCollision, gameStarted, isPaused, gameOver, player, stage]);

  // Rotate tetromino
  const rotate = useCallback((tetromino, dir) => {
    // Make rows become columns (transpose)
    const rotatedTetro = tetromino.map((_, index) =>
      tetromino.map(col => col[index])
    );
    
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  }, []);

  const playerRotate = useCallback((dir) => {
    if (!gameStarted || isPaused || gameOver) return;
    
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);
    
    // Collision detection with walls - "wall kick"
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      // Try to move left and right to avoid collision
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      
      // If offset becomes too large, rotation is not possible
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    
    setPlayer(clonedPlayer);
    audioRef.current.playRotate();
  }, [player, stage, rotate, gameStarted, isPaused, gameOver]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = ({ keyCode }) => {
      if (!gameStarted || isPaused || gameOver) return;
      
      switch (keyCode) {
        case 37: // Left arrow
          movePlayer(-1);
          break;
        case 39: // Right arrow
          movePlayer(1);
          break;
        case 40: // Down arrow
          dropPlayer();
          break;
        case 38: // Up arrow
          playerRotate(1);
          break;
        case 32: // Space
          hardDrop();
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [movePlayer, dropPlayer, playerRotate, hardDrop, gameStarted, isPaused, gameOver]);

  // Handle game level and speed
  useEffect(() => {
    const linePerLevel = 10;
    const newLevel = Math.floor(rows / linePerLevel) + 1;
    
    if (newLevel !== level) {
      setLevel(newLevel);
      if (gameStarted && !isPaused && !gameOver) {
        // Increase speed with level (decrease dropTime)
        setDropTime(Math.max(100, DROPTIME - (newLevel - 1) * 100));
        
        // Notify about level up
        toast({
          title: `¡Nivel ${newLevel}!`,
          description: "La velocidad ha aumentado.",
          variant: "success",
        });
      }
    }
  }, [rows, level, gameStarted, isPaused, gameOver]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetrisHighScore', score);
    }
  }, [score, highScore]);

  // Auto drop interval
  useInterval(() => {
    dropPlayer();
  }, dropTime);

  // Start game
  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(DROPTIME);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
    setScore(0);
    setRows(0);
    setLevel(1);
    setNextTetromino(randomTetromino());
    resetPlayer();
    audioRef.current.playStart();
  };

  // Handle game over
  const handleGameOver = async () => {
    setGameOver(true);
    setGameStarted(false);
    setDropTime(null);
    audioRef.current.playGameOver();
    
    // Save score if user is authenticated
    if (isAuthenticated && user && score > 0) {
      try {
        await addScore({
          gameId: "tetris",
          points: score,
        });

        toast({
          title: "Score saved!",
          description: `Your score of ${score} has been saved.`
        });
      } catch (error) {
        console.error("Error saving score:", error);
        toast({
          title: "Error saving score",
          description: "Your score could not be saved. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Pause/Resume game
  const togglePause = () => {
    if (!gameStarted || gameOver) return;
    
    if (isPaused) {
      // Resume
      setDropTime(Math.max(100, DROPTIME - (level - 1) * 100));
      setIsPaused(false);
      audioRef.current.playStart();
    } else {
      // Pause
      setDropTime(null);
      setIsPaused(true);
      audioRef.current.playPause();
    }
  };

  // Mobile controls handler
  const handleMobileButtonPress = (action) => {
    if (!gameStarted || isPaused || gameOver) return;

    switch (action) {
      case "left":
        movePlayer(-1);
        break;
      case "right":
        movePlayer(1);
        break;
      case "down":
        dropPlayer();
        break;
      case "rotate":
        playerRotate(1);
        break;
      case "drop":
        hardDrop();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} items-start justify-center gap-6`}>
        <div className="flex flex-col items-center">
          {/* Score and level panel */}
          <div className="flex justify-between w-full max-w-[400px] mb-3">
            <div className="text-center">
              <p className="text-sm font-pixel text-gray-300 mb-1">SCORE</p>
              <span className="text-xl">{score}</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-pixel text-gray-300 mb-1">LEVEL</p>
              <span className="text-xl">{level}</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-pixel text-gray-300 mb-1">LINES</p>
              <span className="text-xl">{rows}</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-pixel text-gray-300 mb-1">HIGH</p>
              <span className="text-xl">{highScore}</span>
            </div>
          </div>

          {/* Game area */}
          <div className="relative bg-arcade-dark border-2 border-arcade-neon-blue shadow-[0_0_8px_rgba(0,255,255,0.6)] rounded-md overflow-hidden">
            <canvas
              ref={canvasRef}
              width={STAGE_WIDTH * 25}
              height={STAGE_HEIGHT * 25}
              className="block"
            />

            {/* Game Over overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
                <img
                  src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1746613097/game-over-game_rqfqzb.gif"
                  alt="Game Over"
                  className="w-full h-auto mb-4"
                />
                <p className="text-white font-pixel mb-6">Score: {score}</p>
                <ArcadeButton
                  onClick={startGame}
                  className="bg-arcade-neon-blue hover:bg-arcade-neon-blue/80 text-black font-bold"
                >
                  Play Again
                </ArcadeButton>
                {!isAuthenticated && (
                  <p className="text-gray-400 text-sm mt-4 text-center">
                    Log in to save your score
                  </p>
                )}
              </div>
            )}

            {/* Start screen overlay */}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3">
                 
                  <ArcadeButton
                    onClick={startGame}
                    variant="cyan"
                    className="text-black font-bold mb-2"
                  >
                    <Play size={18} />
                    START GAME
                  </ArcadeButton>
                </div>
              </div>
            )}

            {/* Pause overlay */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <p className="text-yellow-400 text-2xl">PAUSED</p>
              </div>
            )}
          </div>

          {/* Game controls - Desktop */}
          {!isMobile && gameStarted && !gameOver && (
            <div className="mt-4 flex gap-4 justify-center">
              <ArcadeButton
                onClick={togglePause}
                variant="cyan"
                className="text-black font-pixel flex gap-2 items-center"
              >
                {isPaused ? (
                  <>
                    <Play size={18} />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause size={18} />
                    Pause
                  </>
                )}
              </ArcadeButton>

              <ArcadeButton
                onClick={startGame}
                variant="purple"
                className="text-white font-pixel flex gap-2 items-center"
              >
                <RefreshCw size={18} />
                Reset
              </ArcadeButton>
            </div>
          )}

          {/* Mobile Controls - Only visible on mobile */}
          {isMobile && gameStarted && !gameOver && (
            <div className="mt-4 w-full max-w-[400px]">
              {/* Game control buttons */}
              <div className="flex justify-center gap-4 mb-4">
                <ArcadeButton
                  onClick={togglePause}
                  variant="orange"
                  className="text-black font-pixel flex-1 flex justify-center items-center gap-1"
                  size="sm"
                >
                  {isPaused ? (
                    <>
                      <Play size={16} />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause size={16} />
                      Pause
                    </>
                  )}
                </ArcadeButton>

                <ArcadeButton
                  onClick={startGame}
                  variant="green"
                  className="text-black font-pixel flex-1 flex justify-center items-center gap-1"
                  size="sm"
                >
                  <RefreshCw size={16} />
                  Reset
                </ArcadeButton>
              </div>

              {/* Directional controls */}
              <div className="flex flex-col items-center gap-2">
                {/* Rotation button */}
                <ArcadeButton
                  onClick={() => handleMobileButtonPress("rotate")}
                  variant="blue"
                  className="w-16 h-16 text-black font-pixel flex items-center justify-center"
                >
                  <RotateCcw size={24} />
                </ArcadeButton>

                {/* Left, Down, Right buttons */}
                <div className="flex gap-2 mt-1">
                  <ArcadeButton
                    onClick={() => handleMobileButtonPress("left")}
                    variant="blue"
                    className="w-16 h-16 text-black font-pixel flex items-center justify-center"
                  >
                    <ArrowLeft size={24} />
                  </ArcadeButton>

                  <ArcadeButton
                    onClick={() => handleMobileButtonPress("down")}
                    variant="blue"
                    className="w-16 h-16 text-black font-pixel flex items-center justify-center"
                  >
                    <ArrowDown size={24} />
                  </ArcadeButton>

                  <ArcadeButton
                    onClick={() => handleMobileButtonPress("right")}
                    variant="blue"
                    className="w-16 h-16 text-black font-pixel flex items-center justify-center"
                  >
                    <ArrowRight size={24} />
                  </ArcadeButton>
                </div>

                {/* Hard drop button */}
                <ArcadeButton
                  onClick={() => handleMobileButtonPress("drop")}
                  variant="pink"
                  className="mt-2 w-full text-black font-pixel"
                >
                  CAÍDA RÁPIDA
                </ArcadeButton>
              </div>
            </div>
          )}
        </div>

        {/* Side panel with next piece and instructions */}
        <div className={`flex flex-col gap-4 ${isMobile ? "w-full mt-4" : "w-[220px]"}`}>
          {/* Next piece preview */}
          <div className="bg-arcade-dark p-3">
            <h3 className="text-arcade-neon-blue font-pixel mb-2 text-center">Next Piece:</h3>
            <div className="flex justify-center">
              <canvas 
                id="preview-canvas" 
                width="120" 
                height="120" 
                className="block bg-black/30 border border-arcade-neon-blue/20"
              ></canvas>
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-arcade-dark border border-arcade-neon-blue/30 rounded-md p-3">
            <h3 className="text-arcade-neon-blue font-pixel mb-2">Controls:</h3>
            <ul className="text-sm text-gray-300 font-pixel space-y-1">
              <li>⬅️ ➡️ : Move piece</li>
              <li>⬇️ : Move down</li>
              <li>⬆️ : Rotate</li>
              
            </ul>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}
