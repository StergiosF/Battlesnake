/**
 * @module enemy
 * @description Head-to-head collision avoidance for Battlesnake.
 * Identifies potential next moves of enemy snakes that are equal to or larger than ours,
 * preventing accidental head-to-head collisions that result in elimination.
 */

import { MOVE_DELTAS } from './move.js';

/**
 * Returns all potential coordinates an enemy snake could move to next turn.
 * @param {Object} enemyHead - Enemy head coordinate {x, y}.
 * @returns {Object[]} Array of adjacent coordinates [{x, y}].
 */
export function getPossibleEnemyMoves(enemyHead) {
  return Object.values(MOVE_DELTAS).map((delta) => ({
    x: enemyHead.x + delta.x,
    y: enemyHead.y + delta.y,
  }));
}

/**
 * Filters out safe moves that lead into squares that an equal or larger enemy snake could enter next turn.
 * @param {string[]} safeMoves - Current list of safe candidate moves.
 * @param {Object} myHead - Player snake head {x, y}.
 * @param {number} myLength - Player snake length.
 * @param {Object[]} enemySnakes - List of enemy snake objects from game state.
 * @returns {string[]} Moves that avoid dangerous head-to-head collision squares.
 */
export function avoidHeadToHead(safeMoves, myHead, myLength, enemySnakes) {
  if (!enemySnakes || enemySnakes.length === 0 || safeMoves.length === 0) {
    return safeMoves;
  }

  // Collect all dangerous squares (squares adjacent to enemy heads with length >= myLength)
  const dangerousSquares = [];

  for (const enemy of enemySnakes) {
    // Only worry about enemies that are equal or larger
    if (enemy.length >= myLength) {
      const possibleMoves = getPossibleEnemyMoves(enemy.head);
      dangerousSquares.push(...possibleMoves);
    }
  }

  // Filter out moves that would land on a dangerous square
  const movesWithoutHeadToHead = safeMoves.filter((move) => {
    const delta = MOVE_DELTAS[move];
    const nextPos = { x: myHead.x + delta.x, y: myHead.y + delta.y };

    const isDangerous = dangerousSquares.some(
      (sq) => sq.x === nextPos.x && sq.y === nextPos.y
    );

    return !isDangerous;
  });

  // If filtering out head-to-heads leaves at least 1 move, use it.
  // Otherwise, fallback to safeMoves (better to risk head-to-head than guaranteed wall/body crash).
  return movesWithoutHeadToHead.length > 0 ? movesWithoutHeadToHead : safeMoves;
}
