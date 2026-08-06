/**
 * @module index
 * @description Entry point for the Battlesnake application.
 * Configures the snake's appearance and wires up game event handlers.
 */

import runServer from './server.js';
import { chooseMove } from './logic/move.js';

/**
 * Returns the snake's customisation data.
 * This is displayed on the Battlesnake game board.
 * @returns {Object} Snake appearance configuration.
 * @see https://docs.battlesnake.com/api/requests/info
 */
function info() {
  console.log('INFO');
  return {
    apiversion: '1',
    author: 'StergiosF',
    color: '#1a73e8',
    head: 'evil',
    tail: 'bolt',
  };
}

/**
 * Called when a new game starts.
 * @param {Object} gameState - The initial game state from the Battlesnake engine.
 */
function start(gameState) {
  console.log('GAME START');
}

/**
 * Called on each turn. Delegates to the move logic module.
 * @param {Object} gameState - The current game state from the Battlesnake engine.
 * @returns {Object} An object containing the chosen move direction.
 */
function move(gameState) {
  const chosenMove = chooseMove(gameState);
  console.log(`MOVE ${gameState.turn}: ${chosenMove}`);
  return { move: chosenMove };
}

/**
 * Called when a game ends.
 * @param {Object} gameState - The final game state from the Battlesnake engine.
 */
function end(gameState) {
  console.log('GAME OVER');
}

runServer({ info, start, move, end });
