# 🐍 Battlesnake — CCS2430 Software Development in Practice

[![CI/CD Pipeline](https://github.com/StergiosF/Battlesnake/actions/workflows/ci.yml/badge.svg)](https://github.com/StergiosF/Battlesnake/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Code Coverage](https://img.shields.io/badge/coverage-93.2%25-success.svg)](jest.config.js)

An intelligent, autonomous Battlesnake server implemented in **Node.js** and **Express**, developed as an individual project for **CCS2430 Software Development in Practice**.

---

## 📌 Project Overview

This project implements the official [Battlesnake API (v1)](https://docs.battlesnake.com/api). The snake operates as a web server that receives game state HTTP POST requests from the Battlesnake engine and responds with calculated directional moves (`up`, `down`, `left`, `right`) within the strict 500ms execution window.

---

## 🛠️ Architecture & Decision Pipeline

The decision engine uses a deterministic, multi-stage filtering pipeline to evaluate moves each turn.

```
+-------------------------------------------------------------+
|                      Incoming Move Request                  |
+-------------------------------------------------------------+
                              |
                              v
             +---------------------------------+
             |   1. Wall Collision Avoidance   |
             +---------------------------------+
                              |
                              v
             +---------------------------------+
             |   2. Self Body Avoidance        |
             +---------------------------------+
                              |
                              v
             +---------------------------------+
             |   3. Enemy Body Avoidance       |
             +---------------------------------+
                              |
                              v
             +---------------------------------+
             |   4. Head-to-Head Avoidance     |
             +---------------------------------+
                              |
                              v
             +---------------------------------+
             |   5. Flood-Fill Space Check     |
             +---------------------------------+
                              |
                              v
             +---------------------------------+
             |   6. Food Seeking Heuristic     |
             +---------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                       Selected Safe Move                    |
+-------------------------------------------------------------+
```

### Module Responsibilities

| Module | File | Responsibilities |
| :--- | :--- | :--- |
| **Server** | `src/server.js` | Express server handling HTTP endpoints (`/`, `/start`, `/move`, `/end`). |
| **Index** | `src/index.js` | Entry point configuring snake customization (color, head, tail). |
| **Master Move** | `src/logic/move.js` | Orchestrates the decision pipeline and selects the optimal move. |
| **Safety** | `src/logic/safety.js` | Prevents wall collisions by checking board boundary constraints. |
| **Enemy Logic** | `src/logic/enemy.js` | Predicts enemy moves and avoids head-to-head collisions with larger/equal snakes. |
| **Space Logic** | `src/logic/space.js` | Uses Breadth-First Search (BFS) flood fill to prevent moving into trapped dead-ends. |
| **Food Logic** | `src/logic/food.js` | Calculates Manhattan distance to steer towards nearest food when hungry or safe. |

### Repository Structure

```
Battlesnake/
├── .github/workflows/ci.yml   # GitHub Actions: lint, format, tests
├── src/
│   ├── index.js               # Entry point and snake appearance
│   ├── server.js              # Express Battlesnake API
│   └── logic/
│       ├── move.js            # Decision pipeline
│       ├── safety.js          # Wall collision checks
│       ├── enemy.js           # Head-to-head avoidance
│       ├── space.js           # BFS flood-fill
│       └── food.js            # Food-seeking heuristic
├── tests/                     # Jest unit tests per module
├── .editorconfig
├── .eslintrc.json
├── .prettierrc.json
├── jest.config.js
├── package.json
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Response Format |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Snake customization & Metadata | `{ "apiversion": "1", "author": "StergiosF", "color": "#1a73e8", "head": "evil", "tail": "bolt" }` |
| `POST` | `/start` | Called when a new game begins | `"ok"` |
| `POST` | `/move` | Called each turn to get the next move | `{ "move": "up" }` |
| `POST` | `/end` | Called when a game ends | `"ok"` |

---

## 🧪 Unit Testing & Quality Assurance

Quality assurance is enforced using **Jest** for unit testing and code coverage, **ESLint** for static code analysis, and **Prettier** for code formatting.

### Coverage Summary

- **Total Test Suites:** 6 Passed
- **Total Tests:** 18 Passed
- **Overall Line Coverage:** **93.2%** *(Exceeds the >50% course requirement)*

```bash
-----------|---------|----------|---------|---------|-------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------|---------|----------|---------|---------|-------------------
All files  |   92.45 |       86 |   95.65 |    93.2 |                   
 enemy.js  |     100 |     90.9 |     100 |     100 |                   
 food.js   |   95.23 |    83.33 |     100 |      95 |                   
 move.js   |   89.65 |       75 |     100 |   89.65 |                   
 safety.js |     100 |      100 |     100 |     100 |                   
 space.js  |   88.88 |    86.66 |   83.33 |   91.42 |                   
-----------|---------|----------|---------|---------|-------------------
```

`src/index.js` and `src/server.js` are excluded from the coverage report. The 93.2% figure is for the decision-logic modules only.

---

## 📚 Code Documentation

All application modules are documented with **JSDoc**. Each file has an `@module` block, and every exported function documents its parameters and return value.

| Module | File |
| :--- | :--- |
| Server | `src/server.js` |
| Entry point | `src/index.js` |
| Move pipeline | `src/logic/move.js` |
| Wall safety | `src/logic/safety.js` |
| Enemy logic | `src/logic/enemy.js` |
| Flood-fill | `src/logic/space.js` |
| Food seeking | `src/logic/food.js` |

Open those files in the editor to read the JSDoc next to the implementation.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/StergiosF/Battlesnake.git
   cd Battlesnake
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local server:**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:8080`.

### Development Commands

```bash
# Run unit tests
npm test

# Run unit tests with coverage report
npm run test:coverage

# Run ESLint linter
npm run lint

# Check formatting with Prettier
npm run format:check

# Auto-format code with Prettier
npm run format
```

---

## 📋 Software Engineering Methodology

This project followed strict software development practices:
- **Git Flow:** Feature branching model with `main`, `develop`, and `feature/*` branches.
- **Agile Management:** Tracked via GitHub issues, acceptance criteria, and [three milestones](https://github.com/StergiosF/Battlesnake/milestones?state=all).
- **Continuous Integration:** Automated linting, formatting, and tests via [GitHub Actions](https://github.com/StergiosF/Battlesnake/actions/workflows/ci.yml).
- **Release:** Production tag [v1.0.0](https://github.com/StergiosF/Battlesnake/releases/tag/v1.0.0).

---

## ⚠️ Known Limitations

- Food-seeking uses Manhattan distance to the nearest food. It does not path around obstacles, so the snake can walk toward food that is actually blocked.
- Flood-fill treats other snakes as static obstacles for that turn. It does not simulate enemy movement or tail shrinkage.
- If every filtered move is unsafe, the snake falls back to `up`, which can still be a wall or body collision.
- Among remaining candidate moves the snake picks at random, so two identical game states can produce different moves.
- Hazard squares from the Battlesnake engine are ignored.
- `src/index.js` and `src/server.js` are excluded from the Jest coverage report. The 93.2% figure is for the decision-logic modules only.
- There is no lookahead or minimax. The snake is a single-turn filter pipeline, not a search agent.

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
