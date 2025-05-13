
// Datos de juegos disponibles
export const GAMES = [
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'The classic block game. Arrange the falling pieces to create complete lines.',
    imageUrl: '/images/tetris.png',
    path: '/games/tetris',
    difficulty: 'medium',
    category: 'puzzle'
  },
  {
    id: 'tictactoe',
    name: 'TIC-TAC-TOE',
    description: 'Compete against the AI to get three of your symbols in a line.',
    imageUrl: '/images/tictactoe.png',
    path: '/games/tictactoe',
    difficulty: 'easy',
    category: 'strategy'
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Control the snake to eat the food and grow without hitting the edges or yourself.',
    imageUrl: '/images/snake.png',
    path: '/games/snake',
    difficulty: 'medium',
    category: 'classic'
  },
  {
    id: 'pong',
    name: 'Pong',
    description: 'The first successful video game in history. Don\'t let the ball pass your paddle.',
    imageUrl: '/images/pong.png',
    path: '/games/pong',
    difficulty: 'easy',
    category: 'classic'
  },
  {
    id: 'pacman',
    name: 'Pac-Man',
    description: 'Eat all the dots while avoiding the ghosts in this iconic arcade game.',
    imageUrl: '/images/pacman.png',
    path: '/games/pacman',
    difficulty: 'medium',
    category: 'classic'
  },
  {
    id: 'arkanoid',
    name: 'Arkanoid',
    description: 'Destroy all the blocks with the ball, collecting power-ups along the way.',
    imageUrl: '/images/arkanoid.png',
    path: '/games/arkanoid',
    difficulty: 'medium',
    category: 'action'
  },
  {
    id: 'connect4',
    name: 'Connect 4',
    description: 'Take turns dropping chips and connect four of the same color in a row.',
    imageUrl: '/images/connect4.png',
    path: '/games/connect4',
    difficulty: 'medium',
    category: 'strategy'
  }
];

// Función para obtener un juego por su ID
export function getGameById(id) {
  return GAMES.find(game => game.id === id);
}

// Función para filtrar juegos por categoría
export function getGamesByCategory(category) {
  return GAMES.filter(game => game.category === category);
}
