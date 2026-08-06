import { describe, expect, test } from '@jest/globals';
import { getAvoidWallMoves } from '../src/logic/safety.js';

describe('Safety Module - Wall Avoidance', () => {
  test('prevents moving left when at left wall (x = 0)', () => {
    const moves = ['up', 'down', 'left', 'right'];
    const head = { x: 0, y: 5 };
    const safe = getAvoidWallMoves(moves, head, 11, 11);
    expect(safe).not.toContain('left');
    expect(safe).toEqual(expect.arrayContaining(['up', 'down', 'right']));
  });

  test('prevents moving right when at right wall (x = 10 on 11x11 board)', () => {
    const moves = ['up', 'down', 'left', 'right'];
    const head = { x: 10, y: 5 };
    const safe = getAvoidWallMoves(moves, head, 11, 11);
    expect(safe).not.toContain('right');
  });

  test('prevents moving down when at bottom wall (y = 0)', () => {
    const moves = ['up', 'down', 'left', 'right'];
    const head = { x: 5, y: 0 };
    const safe = getAvoidWallMoves(moves, head, 11, 11);
    expect(safe).not.toContain('down');
  });

  test('prevents moving up when at top wall (y = 10 on 11x11 board)', () => {
    const moves = ['up', 'down', 'left', 'right'];
    const head = { x: 5, y: 10 };
    const safe = getAvoidWallMoves(moves, head, 11, 11);
    expect(safe).not.toContain('up');
  });

  test('allows all moves when in the center of the board', () => {
    const moves = ['up', 'down', 'left', 'right'];
    const head = { x: 5, y: 5 };
    const safe = getAvoidWallMoves(moves, head, 11, 11);
    expect(safe).toHaveLength(4);
  });
});
