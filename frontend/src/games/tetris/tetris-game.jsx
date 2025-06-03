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
import GameOverGlitchText from "./GameOverGlitchText";

// FORMAS DE LOS TETRIMINOS
const TETROMINOS = {
  0: { shape: [[0]], color: '0, 0, 0' },
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0]
    ],
    color: '80, 227, 230', // cian
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0]
    ],
    color: '36, 95, 223', // azul
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L']
    ],
    color: '223, 173, 36', // naranja
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O'],
    ],
    color: '223, 217, 36', // amarillo
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0]
    ],
    color: '48, 211, 56', // verde
  },
  T: {
    shape: [
      [0, 0, 0],
      ['T', 'T', 'T'],
      [0, 'T', 0]
    ],
    color: '132, 61, 198', // morado
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0]
    ],
    color: '227, 78, 78', // rojo
  }
};

// Generador aleatorio de Tetriminos
const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

// CONSTANTES DEL JUEGO
const STAGE_WIDTH = 12;
const STAGE_HEIGHT = 20;
const ROWPOINTS = [40, 100, 300, 1200]; // Puntos por 1, 2, 3, 4 líneas
const DROPTIME = 1000; // Tiempo de caída inicial

// Crear escenario vacío - Array 2D lleno de ceros
const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  );

// Comprobar si el tetrimino colisiona con los bordes o bloques existentes
const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[0].length; x += 1) {
      // 1. Comprobar que estamos en una celda del tetrimino
      if (player.tetromino[y][x] !== 0) {
        if (
          // 2. Comprobar que el movimiento está dentro del área de juego (altura)
          !stage[y + player.pos.y + moveY] ||
          // 3. Comprobar que el movimiento está dentro del área de juego (ancho)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Comprobar si la celda a la que nos movemos no está libre
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
  
  // Estados del juego
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
  
  // Estado del jugador - con tetrimino, posición y detección de colisión
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  // Referencias
  const canvasRef = useRef(null);
  const audioRef = useRef(new Audio());

  // Efecto para cargar la puntuación más alta del almacenamiento local
  useEffect(() => {
    const storedHighScore = localStorage.getItem('tetrisHighScore') || 0;
    setHighScore(Number(storedHighScore));
  }, []);

  // Prevenir el scroll cuando el juego está activo
  useEffect(() => {
    if (gameStarted) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [gameStarted]);

  // Actualizar el escenario (campo de juego)
  const updateStage = useCallback(prevStage => {
    // Primero limpiar el escenario
    const newStage = prevStage.map(row =>
      row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
    );

    // Luego dibujar el tetrimino
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
    
    // Comprobar si colisionamos
    if (player.collided) {
      resetPlayer();
      return sweepRows(newStage);
    }
    
    return newStage;
  }, [player]);

  // Actualizar el escenario al mover el jugador
  useEffect(() => {
    if (!gameOver && gameStarted && !isPaused) {
      setStage(prev => updateStage(prev));
    }
  }, [player, updateStage, gameOver, gameStarted, isPaused]);

  // Dibujar el juego en el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / STAGE_WIDTH;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar líneas de la cuadrícula
    ctx.strokeStyle = '#333';
    
    // Líneas horizontales
    for (let y = 0; y <= STAGE_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvas.width, y * cellSize);
      ctx.stroke();
    }
    
    // Líneas verticales
    for (let x = 0; x <= STAGE_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvas.height);
      ctx.stroke();
    }

    // Dibujar celdas rellenas
    stage.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell[0] !== 0) {
          const tetroType = cell[0];
          const color = TETROMINOS[tetroType].color;
          
          ctx.fillStyle = `rgba(${color}, 1)`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Borde de la celda
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });
  }, [stage]);

  // Dibujar el tetrimino de previsualización
  const drawPreviewTetromino = useCallback(() => {
    if (!nextTetromino || !canvasRef.current) return;
    
    const previewCanvas = document.getElementById('preview-canvas');
    if (!previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    const cellSize = previewCanvas.width / 6; // Celdas más pequeñas para la previsualización
    
    // Limpiar canvas
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    const tetro = nextTetromino;
    
    // Calcular posición centrada
    const offsetX = (6 - tetro.shape[0].length) / 2;
    const offsetY = (6 - tetro.shape.length) / 2;
    
    // Dibujar tetrimino
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
          
          // Borde de la celda
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

  // Reiniciar la posición del jugador y generar nuevo tetrimino
  const resetPlayer = useCallback(() => {
    let newTetromino;
    
    if (nextTetromino) {
      newTetromino = nextTetromino;
    } else {
      newTetromino = randomTetromino();
    }
    
    // Generar siguiente tetrimino
    setNextTetromino(randomTetromino());
    
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: newTetromino.shape,
      collided: false,
    });
    
    // Comprobar si es game over (colisión inmediata tras reiniciar)
    if (checkCollision(
      { pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, tetromino: newTetromino.shape, collided: false },
      stage,
      { x: 0, y: 0 }
    )) {
      handleGameOver();
    }
  }, [nextTetromino, stage]);

  // Comprobar filas completas y limpiarlas
  const sweepRows = useCallback((newStage) => {
    let rowsCleared = 0;
    
    const stage = newStage.reduce((acc, row) => {
      // Si ninguna celda de la fila es 0, la fila está llena
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        rowsCleared += 1;
        // Añadir fila vacía al principio
        acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
        return acc;
      }
      acc.push(row);
      return acc;
    }, []);
    
    if (rowsCleared > 0) {
      // Reproducir sonido
      audioRef.current.playLineClear();
      
      // Actualizar puntuación
      setRows(prev => prev + rowsCleared);
      setScore(prev => prev + ROWPOINTS[rowsCleared - 1] * level);
    }
    
    return stage;
  }, [level]);

  // Mover tetrimino a la izquierda o derecha
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
  
  // Bajar el tetrimino una fila
  const dropPlayer = useCallback(() => {
    if (!gameStarted || isPaused || gameOver) return;
    
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x, y: prev.pos.y + 1 }
      }));
    } else {
      // Comprobar game over
      if (player.pos.y < 1) {
        handleGameOver();
        return;
      }
      
      // Unir tetrimino con el escenario
      setPlayer(prev => ({
        ...prev,
        collided: true
      }));
      audioRef.current.playLand();
    }
  }, [checkCollision, gameStarted, isPaused, gameOver, player, stage]);
  
  // Caída rápida - el tetrimino cae hasta el fondo instantáneamente
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

  // Rotar tetrimino
  const rotate = useCallback((tetromino, dir) => {
    // Hacer que las filas se conviertan en columnas (transponer)
    const rotatedTetro = tetromino.map((_, index) =>
      tetromino.map(col => col[index])
    );
    
    // Invertir cada fila para obtener la matriz rotada
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  }, []);

  const playerRotate = useCallback((dir) => {
    if (!gameStarted || isPaused || gameOver) return;
    
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);
    
    // Detección de colisión con paredes - "wall kick"
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      // Intentar mover a la izquierda y derecha para evitar colisión
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      
      // Si el offset es demasiado grande, la rotación no es posible
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    
    setPlayer(clonedPlayer);
    audioRef.current.playRotate();
  }, [player, stage, rotate, gameStarted, isPaused, gameOver]);

  // Manejar entrada del teclado
  useEffect(() => {
    const handleKeyDown = ({ keyCode }) => {
      if (!gameStarted || isPaused || gameOver) return;
      
      switch (keyCode) {
        case 37: // Flecha izquierda
          movePlayer(-1);
          break;
        case 39: // Flecha derecha
          movePlayer(1);
          break;
        case 40: // Flecha abajo
          dropPlayer();
          break;
        case 38: // Flecha arriba
          playerRotate(1);
          break;
        case 32: // Espacio
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

  // Manejar nivel y velocidad del juego
  useEffect(() => {
    const linePerLevel = 10;
    const newLevel = Math.floor(rows / linePerLevel) + 1;
    
    if (newLevel !== level) {
      setLevel(newLevel);
      if (gameStarted && !isPaused && !gameOver) {
        // Aumentar velocidad con el nivel (disminuir dropTime)
        setDropTime(Math.max(100, DROPTIME - (newLevel - 1) * 100));
        
        // Notificar subida de nivel
        toast({
          title: `Level ${newLevel}!`,
          description: "Speed has increased.",
          variant: "success",
        });
      }
    }
  }, [rows, level, gameStarted, isPaused, gameOver]);

  // Actualizar puntuación más alta
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetrisHighScore', score);
    }
  }, [score, highScore]);

  // Intervalo de caída automática
  useInterval(() => {
    dropPlayer();
  }, dropTime);

  // Iniciar juego
  const startGame = () => {
    // Reiniciar todo
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

  // Manejar game over
  const handleGameOver = async () => {
    setGameOver(true);
    setGameStarted(false);
    setDropTime(null);
    audioRef.current.playGameOver();
    
    // Guardar puntuación si el usuario está autenticado
    if (isAuthenticated && user && score > 0) {
      try {
        await addScore({
          gameId: "tetris",
          points: score,
        });

        toast({
          title: "¡Puntuación guardada!",
          description: `Tu puntuación de ${score} ha sido guardada.`
        });
      } catch (error) {
        console.error("Error al guardar la puntuación:", error);
        toast({
          title: "Error al guardar la puntuación",
          description: "No se pudo guardar tu puntuación. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  // Pausar/Reanudar juego
  const togglePause = () => {
    if (!gameStarted || gameOver) return;
    
    if (isPaused) {
      // Reanudar
      setDropTime(Math.max(100, DROPTIME - (level - 1) * 100));
      setIsPaused(false);
      audioRef.current.playStart();
    } else {
      // Pausar
      setDropTime(null);
      setIsPaused(true);
      audioRef.current.playPause();
    }
  };

  // Manejador de controles móviles
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
          {/* Panel de puntuacion y nivel */}
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

          {/* Area de juego */}
          <div className="relative bg-arcade-dark border-2 border-arcade-neon-blue shadow-[0_0_8px_rgba(0,255,255,0.6)] rounded-md overflow-hidden">
            <canvas
              ref={canvasRef}
              width={STAGE_WIDTH * 25}
              height={STAGE_HEIGHT * 25}
              className="block"
            />

            {/* Game Over overlay */}
            {gameOver && (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
                <GameOverGlitchText className="mb-6" />
                <p className="text-white font-pixel mb-6">Score: {score}</p>
                <ArcadeButton
                  onClick={startGame}
                  className="bg-arcade-neon-blue hover:bg-arcade-neon-blue/80 text-black font-bold pointer-events-auto"
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

            {/* Pantalla de inicio overlay */}
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

          {/* Controles - Escritorio */}
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

          {/* Controles móvil - Sólo visible en móvil */}
          {isMobile && gameStarted && !gameOver && (
            <div className="mt-4 w-full max-w-[400px]">
              {/* Botones de control */}
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

              {/* controles direccionales */}
              <div className="flex flex-col items-center gap-2">
                {/* botón de rotación */}
                <ArcadeButton
                  onClick={() => handleMobileButtonPress("rotate")}
                  variant="blue"
                  className="w-16 h-16 text-black font-pixel flex items-center justify-center"
                >
                  <RotateCcw size={24} />
                </ArcadeButton>

                {/* izquierda, abajo, derecha botones */}
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

                {/* Caída rápida */}
                <ArcadeButton
                  onClick={() => handleMobileButtonPress("drop")}
                  variant="pink"
                  className="mt-2 w-full text-black font-pixel"
                >
                  Fast drop
                </ArcadeButton>
              </div>
            </div>
          )}
        </div>

        {/* Panel lateral con la pieza siguiente e instrucciones */}
        <div className={`flex flex-col gap-4 ${isMobile ? "w-full mt-4" : "w-[220px]"}`}>
          {/* preview de la siguiente pieza */}
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
          
          {/* Controles */}
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
