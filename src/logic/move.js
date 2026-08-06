/**
 * @module move
 * @description Main move-decision module for the Battlesnake.
 * Orchestrates safety checks to choose a valid move each turn.
 */

import { getAvoidWallMoves } from './safety.js';

/**
 * All possible move directions.
 * @type {string[]}
 */
const ALL_MOVES = ['up', 'down', 'left', 'right'];

/**
 * Maps a move direction to its coordinate offset.
 * Battlesnake uses (0,0) at bottom-left, y increases upward.
 * @type {Object.<string, {x: number, y: number}>}
 */
export const MOVE_DELTAS = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Returns the coordinate that would result from making a move from a position.
 * @param {Object} position - The current position {x, y}.
 * @param {string} move - The direction to move.
 * @returns {Object} The resulting position {x, y}.
 */
export function getNextPosition(position, move) {
  const delta = MOVE_DELTAS[move];
  return {
    x: position.x + delta.x,
    y: position.y + delta.y,
  };
}

/**
 * Chooses the best move for the snake given the current game state.
 * Eliminates unsafe moves (walls, self-body, other snakes) and picks
 * from the remaining safe options.
 *
 * @param {Object} gameState - The game state from the Battlesnake engine.
 * @param {Object} gameState.board - The board state (width, height, snakes, food).
 * @param {Object} gameState.you - The player's snake data.
 * @returns {string} The chosen move direction ('up', 'down', 'left', or 'right').
 */
export function chooseMove(gameState) {
  const myHead = gameState.you.head;

  // Start with all four possible moves
  let safeMoves = [...ALL_MOVES];

  // Step 1: Remove moves that would hit walls
  safeMoves = getAvoidWallMoves(
    safeMoves,
    myHead,
    gameState.board.width,
    gameState.board.height
  );

  // Step 2: Remove moves that would hit our own body
  safeMoves = avoidSnakeBody(safeMoves, myHead, gameState.you.body);

  // Step 3: Remove moves that would hit other snakes
  const otherSnakes = gameState.board.snakes.filter(
    (snake) => snake.id !== gameState.you.id
  );
  for (const snake of otherSnakes) {
    safeMoves = avoidSnakeBody(safeMoves, myHead, snake.body);
  }

  // If no safe moves remain, go up as a last resort
  if (safeMoves.length === 0) {
    console.log('No safe moves detected! Moving up as last resort.');
    return 'up';
  }

  // Pick a random safe move for now (will be improved in Stage 2)
  const chosenMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  return chosenMove;
}

/**
 * Filters out moves that would cause the snake to collide with a body.
 * Works for both self-collision and other-snake collision avoidance.
 *
 * @param {string[]} possibleMoves - The currently available moves.
 * @param {Object} head - The snake's head position {x, y}.
 * @param {Object[]} body - Array of body segment coordinates [{x, y}].
 * @returns {string[]} Moves that do not collide with the given body.
 */
export function avoidSnakeBody(possibleMoves, head, body) {
  return possibleMoves.filter((move) => {
    const nextPos = getNextPosition(head, move);

    // Check if the next position overlaps any body segment
    const collidesWithBody = body.some(
      (segment) => segment.x === nextPos.x && segment.y === nextPos.y
    );

    return !collidesWithBody;
  });
}
