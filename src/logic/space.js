/**
 * @module space
 * @description Space evaluation and flood-fill logic for Battlesnake.
 * Uses Breadth-First Search (BFS) to count available tiles reachable from a candidate position,
 * preventing the snake from entering enclosed dead-ends.
 */

import { getNextPosition, MOVE_DELTAS } from './move.js';

/**
 * Counts reachable tiles from a starting position using a Flood-Fill (BFS) algorithm.
 * Stops counting early if maxSpace limit is reached (optimisation).
 *
 * @param {Object} startPos - Candidate position {x, y}.
 * @param {number} boardWidth - Width of board.
 * @param {number} boardHeight - Height of board.
 * @param {Set<string>} obstacleSet - Set of blocked coordinate keys ("x,y").
 * @param {number} maxSpace - Maximum space count needed (usually snake body length).
 * @returns {number} Count of reachable open tiles.
 */
export function floodFill(
  startPos,
  boardWidth,
  boardHeight,
  obstacleSet,
  maxSpace
) {
  const queue = [startPos];
  const visited = new Set();
  visited.add(`${startPos.x},${startPos.y}`);

  let count = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    count++;

    if (count >= maxSpace) {
      return count;
    }

    for (const move of ['up', 'down', 'left', 'right']) {
      const delta = MOVE_DELTAS[move];
      const neighbor = { x: current.x + delta.x, y: current.y + delta.y };
      const key = `${neighbor.x},${neighbor.y}`;

      // Boundary check
      const inBounds =
        neighbor.x >= 0 &&
        neighbor.x < boardWidth &&
        neighbor.y >= 0 &&
        neighbor.y < boardHeight;

      if (inBounds && !obstacleSet.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return count;
}

/**
 * Filters out moves that lead to spaces smaller than the snake's length (dead ends).
 *
 * @param {string[]} safeMoves - Candidate moves.
 * @param {Object} head - Snake head position {x, y}.
 * @param {number} boardWidth - Board width.
 * @param {number} boardHeight - Board height.
 * @param {Object[]} allSnakes - Array of all snakes on the board.
 * @param {number} requiredSpace - Space needed (typically snake body length).
 * @returns {string[]} Moves that provide sufficient open space.
 */
export function avoidSmallSpaces(
  safeMoves,
  head,
  boardWidth,
  boardHeight,
  allSnakes,
  requiredSpace
) {
  if (safeMoves.length === 0) {
    return safeMoves;
  }

  // Build obstacle set for all snake body segments
  const obstacleSet = new Set();
  for (const snake of allSnakes) {
    for (const segment of snake.body) {
      obstacleSet.add(`${segment.x},${segment.y}`);
    }
  }

  // Evaluate space for each move
  const moveSpaceMap = safeMoves.map((move) => {
    const nextPos = getNextPosition(head, move);
    const availableSpace = floodFill(
      nextPos,
      boardWidth,
      boardHeight,
      obstacleSet,
      requiredSpace
    );
    return { move, space: availableSpace };
  });

  // Filter moves with space >= requiredSpace
  const spaciousMoves = moveSpaceMap
    .filter((item) => item.space >= requiredSpace)
    .map((item) => item.move);

  // If moves with sufficient space exist, return them
  if (spaciousMoves.length > 0) {
    return spaciousMoves;
  }

  // Fallback: Pick the move that maximizes available space
  moveSpaceMap.sort((a, b) => b.space - a.space);
  return [moveSpaceMap[0].move];
}
