/**
 * @module food
 * @description Food-seeking algorithms for Battlesnake.
 * Calculates distance to available food items and ranks safe moves by how close they get to food.
 */

import { getNextPosition } from './move.js';

/**
 * Calculates Manhattan distance between two points {x, y}.
 * @param {Object} p1 - First point {x, y}.
 * @param {Object} p2 - Second point {x, y}.
 * @returns {number} Manhattan distance.
 */
export function getManhattanDistance(p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

/**
 * Finds the closest food coordinate to a given head position.
 * @param {Object} head - Snake head position {x, y}.
 * @param {Object[]} foodList - List of food positions [{x, y}].
 * @returns {Object|null} The closest food position object, or null if no food.
 */
export function getClosestFood(head, foodList) {
  if (!foodList || foodList.length === 0) {
    return null;
  }

  let closest = foodList[0];
  let minDistance = getManhattanDistance(head, closest);

  for (let i = 1; i < foodList.length; i++) {
    const dist = getManhattanDistance(head, foodList[i]);
    if (dist < minDistance) {
      minDistance = dist;
      closest = foodList[i];
    }
  }

  return closest;
}

/**
 * Filters and prioritises safe moves that get the snake closer to the target food.
 * @param {string[]} safeMoves - Current array of safe candidate moves.
 * @param {Object} head - Snake head position {x, y}.
 * @param {Object[]} foodList - List of food positions on the board.
 * @returns {string[]} Moves that decrease distance to closest food (or all safe moves if no food/closer move).
 */
export function getFoodSeekingMoves(safeMoves, head, foodList) {
  const closestFood = getClosestFood(head, foodList);
  if (!closestFood || safeMoves.length === 0) {
    return safeMoves;
  }

  const currentDist = getManhattanDistance(head, closestFood);

  // Filter moves that result in a strictly smaller distance to closest food
  const movesTowardsFood = safeMoves.filter((move) => {
    const nextPos = getNextPosition(head, move);
    const newDist = getManhattanDistance(nextPos, closestFood);
    return newDist < currentDist;
  });

  // Return food-seeking moves if any exist; otherwise fall back to all safe moves
  return movesTowardsFood.length > 0 ? movesTowardsFood : safeMoves;
}
