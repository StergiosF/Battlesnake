/**
 * @module move
 * @description Main move-decision module for the Battlesnake.
 * Integrates safety checks, head-to-head collision avoidance, flood-fill space evaluation, and food seeking.
 */

import { getAvoidWallMoves } from './safety.js';
import { getFoodSeekingMoves } from './food.js';
import { avoidHeadToHead } from './enemy.js';
import { avoidSmallSpaces } from './space.js';

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

    const collidesWithBody = body.some(
      (segment) => segment.x === nextPos.x && segment.y === nextPos.y
    );

    return !collidesWithBody;
  });
}

/**
 * Chooses the best move for the snake given the current game state.
 * Evaluates safety through a pipeline of logic filters:
 * 1. Avoid walls
 * 2. Avoid self-body
 * 3. Avoid other snake bodies
 * 4. Avoid head-to-head collisions with larger/equal enemies
 * 5. Avoid trapped dead-ends (flood-fill space evaluation)
 * 6. Seek food if hungry or safe
 *
 * @param {Object} gameState - The game state from the Battlesnake engine.
 * @returns {string} The chosen move direction ('up', 'down', 'left', or 'right').
 */
export function chooseMove(gameState) {
  const myHead = gameState.you.head;
  const myLength = gameState.you.length;
  const myHealth = gameState.you.health;
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  // Pipeline Step 1: Wall collision avoidance
  let safeMoves = getAvoidWallMoves(
    [...ALL_MOVES],
    myHead,
    boardWidth,
    boardHeight
  );

  // Pipeline Step 2: Self body avoidance
  safeMoves = avoidSnakeBody(safeMoves, myHead, gameState.you.body);

  // Pipeline Step 3: Other snake body avoidance
  const otherSnakes = gameState.board.snakes.filter(
    (snake) => snake.id !== gameState.you.id
  );
  for (const snake of otherSnakes) {
    safeMoves = avoidSnakeBody(safeMoves, myHead, snake.body);
  }

  // Fallback check: If no safe moves, pick 'up' as last resort
  if (safeMoves.length === 0) {
    console.log('No safe moves detected! Moving up as last resort.');
    return 'up';
  }

  // Pipeline Step 4: Head-to-head avoidance against equal or larger snakes
  safeMoves = avoidHeadToHead(safeMoves, myHead, myLength, otherSnakes);

  // Pipeline Step 5: Flood-fill space evaluation (avoid dead ends smaller than body length)
  safeMoves = avoidSmallSpaces(
    safeMoves,
    myHead,
    boardWidth,
    boardHeight,
    gameState.board.snakes,
    myLength
  );

  // Pipeline Step 6: Food-seeking logic
  // Prioritise food if health is below 50 or food exists
  if (myHealth < 50 || gameState.board.food.length > 0) {
    safeMoves = getFoodSeekingMoves(safeMoves, myHead, gameState.board.food);
  }

  // Pick candidate move
  const chosenMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  return chosenMove;
}
