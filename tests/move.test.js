import { describe, expect, test } from '@jest/globals';
import { chooseMove, avoidSnakeBody } from '../src/logic/move.js';

describe('Move Module - Master Controller', () => {
  test('avoidSnakeBody filters out colliding move', () => {
    const head = { x: 5, y: 5 };
    const body = [
      { x: 5, y: 5 },
      { x: 5, y: 4 }, // Body below head
    ];
    const safe = avoidSnakeBody(['up', 'down', 'left', 'right'], head, body);
    expect(safe).not.toContain('down');
  });

  test('chooseMove returns a valid move string given full gameState', () => {
    const gameState = {
      game: { id: 'game-1' },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        food: [{ x: 5, y: 6 }],
        hazards: [],
        snakes: [
          {
            id: 'my-snake-id',
            name: 'StergiosSnake',
            health: 90,
            body: [
              { x: 5, y: 5 },
              { x: 5, y: 4 },
              { x: 5, y: 3 },
            ],
            head: { x: 5, y: 5 },
            length: 3,
          },
        ],
      },
      you: {
        id: 'my-snake-id',
        name: 'StergiosSnake',
        health: 90,
        body: [
          { x: 5, y: 5 },
          { x: 5, y: 4 },
          { x: 5, y: 3 },
        ],
        head: { x: 5, y: 5 },
        length: 3,
      },
    };

    const move = chooseMove(gameState);
    expect(['up', 'down', 'left', 'right']).toContain(move);
  });
});
