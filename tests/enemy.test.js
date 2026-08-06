import { describe, expect, test } from '@jest/globals';
import { avoidHeadToHead, getPossibleEnemyMoves } from '../src/logic/enemy.js';

describe('Enemy Module - Head-to-Head Avoidance', () => {
  test('calculates 4 adjacent possible enemy moves', () => {
    const enemyHead = { x: 5, y: 5 };
    const possible = getPossibleEnemyMoves(enemyHead);
    expect(possible).toHaveLength(4);
    expect(possible).toContainEqual({ x: 5, y: 6 });
    expect(possible).toContainEqual({ x: 5, y: 4 });
  });

  test('avoids moving into squares that a larger enemy can enter', () => {
    const myHead = { x: 5, y: 5 };
    const myLength = 3;
    const enemySnakes = [
      {
        id: 'enemy-1',
        length: 4, // Larger enemy
        head: { x: 5, y: 7 }, // Enemy head is at (5,7). It can move down to (5,6).
      },
    ];

    const safeMoves = ['up', 'down', 'left', 'right'];
    // Moving 'up' from (5,5) leads to (5,6), which overlaps enemy's potential move down to (5,6)
    const filtered = avoidHeadToHead(safeMoves, myHead, myLength, enemySnakes);
    expect(filtered).not.toContain('up');
  });

  test('ignores smaller enemies in head-to-head calculations', () => {
    const myHead = { x: 5, y: 5 };
    const myLength = 5;
    const enemySnakes = [
      {
        id: 'enemy-smaller',
        length: 2, // Smaller enemy, we win head-to-head
        head: { x: 5, y: 7 },
      },
    ];

    const safeMoves = ['up', 'down', 'left', 'right'];
    const filtered = avoidHeadToHead(safeMoves, myHead, myLength, enemySnakes);
    expect(filtered).toContain('up');
  });
});
