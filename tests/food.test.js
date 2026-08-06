import { describe, expect, test } from '@jest/globals';
import {
  getManhattanDistance,
  getClosestFood,
  getFoodSeekingMoves,
} from '../src/logic/food.js';

describe('Food Module - Distance & Seeking', () => {
  test('correctly calculates Manhattan distance', () => {
    const p1 = { x: 1, y: 1 };
    const p2 = { x: 4, y: 5 };
    expect(getManhattanDistance(p1, p2)).toBe(7);
  });

  test('returns null when food list is empty', () => {
    const head = { x: 5, y: 5 };
    expect(getClosestFood(head, [])).toBeNull();
  });

  test('identifies closest food from a list', () => {
    const head = { x: 0, y: 0 };
    const foodList = [
      { x: 5, y: 5 },
      { x: 1, y: 2 },
      { x: 10, y: 10 },
    ];
    const closest = getClosestFood(head, foodList);
    expect(closest).toEqual({ x: 1, y: 2 });
  });

  test('filters moves to prioritize direction towards closest food', () => {
    const head = { x: 5, y: 5 };
    const foodList = [{ x: 5, y: 8 }]; // Food is directly UP
    const safeMoves = ['up', 'down', 'left', 'right'];

    const foodMoves = getFoodSeekingMoves(safeMoves, head, foodList);
    expect(foodMoves).toEqual(['up']);
  });
});
