/**
 * @module server
 * @description Express server for the Battlesnake API.
 * Exposes four endpoints that the Battlesnake engine calls:
 * - GET  /       → returns snake info (appearance)
 * - POST /start  → called when a game begins
 * - POST /move   → called each turn to get the snake's next move
 * - POST /end    → called when a game ends
 */

import express from 'express';

/**
 * Starts the Battlesnake HTTP server.
 * @param {Object} handlers - Object containing handler functions.
 * @param {Function} handlers.info - Returns snake customisation data.
 * @param {Function} handlers.start - Called when a game starts.
 * @param {Function} handlers.move - Called each turn; must return { move: string }.
 * @param {Function} handlers.end - Called when a game ends.
 */
export default function runServer(handlers) {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send(handlers.info());
  });

  app.post('/start', (req, res) => {
    handlers.start(req.body);
    res.send('ok');
  });

  app.post('/move', (req, res) => {
    res.send(handlers.move(req.body));
  });

  app.post('/end', (req, res) => {
    handlers.end(req.body);
    res.send('ok');
  });

  const host = '0.0.0.0';
  const port = process.env.PORT || 8080;

  app.listen(port, host, () => {
    console.log(`Battlesnake Server listening at http://${host}:${port}`);
  });
}
