import { describe, expect, test } from '@jest/globals';
import { floodFill, avoidSmallSpaces } from '../src/logic/space.js';

describe('Space Module - Flood Fill & Trap Avoidance', () => {
  test('counts reachable space correctly in an open area', () => {
    const startPos = { x: 1, y: 1 };
    const obstacleSet = new Set();
    const space = floodFill(startPos, 11, 11, obstacleSet, 10);
    expect(space).toBeGreaterThanOrEqual(10);
  });

  test('stops counting when obstacle blocks path', () => {
    const startPos = { x: 0, y: 0 };
    // Trap (0,0) with obstacles at (0,1) and (1,0)
    const obstacleSet = new Set(['0,1', '1,0']);
    const space = floodFill(startPos, 11, 11, obstacleSet, 10);
    expect(space).toBe(1);
  });

  test('avoids moves that lead to trapped spaces smaller than body length', () => {
    const head = { x: 1, y: 1 };
    const safeMoves = ['up', 'right'];

    // Snake of length 4
    const allSnakes = [
      {
        id: 'me',
        body: [
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 2, y: 1 },
          { x: 0, y: 2 },
        ],
      },
    ];

    const result = avoidSmallSpaces(safeMoves, head, 11, 11, allSnakes, 4);
    expect(result.length).toBeGreaterThan(0);
  });
});
