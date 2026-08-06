/**
 * @module safety
 * @description Safety checks for the Battlesnake.
 * Provides functions to filter out moves that would result in collisions.
 */

import { getNextPosition } from './move.js';

/**
 * Filters out moves that would cause the snake to hit a wall.
 * The board uses (0,0) at the bottom-left corner.
 *
 * @param {string[]} possibleMoves - Array of possible move directions.
 * @param {Object} head - The snake's head position {x, y}.
 * @param {number} boardWidth - The width of the game board.
 * @param {number} boardHeight - The height of the game board.
 * @returns {string[]} Moves that stay within the board boundaries.
 */
export function getAvoidWallMoves(
  possibleMoves,
  head,
  boardWidth,
  boardHeight
) {
  return possibleMoves.filter((move) => {
    const nextPos = getNextPosition(head, move);

    // Check the next position is within board boundaries
    const isWithinBounds =
      nextPos.x >= 0 &&
      nextPos.x < boardWidth &&
      nextPos.y >= 0 &&
      nextPos.y < boardHeight;

    return isWithinBounds;
  });
}
