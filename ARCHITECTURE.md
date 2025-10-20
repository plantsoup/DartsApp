# DartsApp Architecture

## File Structure

```
DartsApp/
├── index.html           # Main HTML page
├── app.js               # WebSocket & dartboard rendering
├── styles.css           # All styles & animations
├── games/               # Game modules (modular structure)
│   ├── index.js         # Game system & main exports
│   ├── base.js          # BaseGame class & shared utilities
│   ├── killer.js        # Killer game
│   ├── x01.js           # 301 game
│   ├── cricket.js       # Cricket game
│   └── snakes-ladders.js # Snakes & Ladders game
└── README.md            # Documentation
```

## Code Organization

### Base Game Class
All games extend from `BaseGame` which provides:

```javascript
class BaseGame {
  // Common properties
  - players
  - currentPlayerIndex
  - gameOver
  - winner
  
  // Shared methods
  - getCurrentPlayer()      // Get active player
  - updateStatus(msg1, msg2) // Update UI status
  - nextPlayerIndex()        // Cycle to next player
  - showWinner(info)        // Display winner screen
}
```

### Game Classes

**KillerGame** - Elimination game
- Extends BaseGame
- Random number assignment
- Lives system
- Killer status tracking

**X01Game** - Race to zero (301/501)
- Extends BaseGame
- Score tracking
- Average calculation
- Bust detection
- Double-out option

**CricketGame** - Close numbers
- Extends BaseGame
- Mark tracking (/, //, X)
- Points scoring
- Win condition: all closed + highest score

**SnakesAndLaddersGame** - Board race
- Extends BaseGame
- Visual 10x10 board
- Snakes (slide down) and Ladders (climb up)
- Position-based gameplay

## Shared Constants

```javascript
PLAYER_COLORS // Consistent colors across all games
```

## Benefits of Refactoring

✅ **Reduced Code Duplication**
- Common methods extracted to BaseGame
- Winner screen logic centralized
- Status update logic shared

✅ **Easier Maintenance**
- Change once, affects all games
- Clear inheritance structure
- Consistent behavior

✅ **Better Scalability**
- New games easily extend BaseGame
- Common features automatically included
- Less boilerplate per game

✅ **Improved Readability**
- Clear separation of concerns
- Each game focuses on unique logic
- Inheritance chain visible

## Code Metrics

### Evolution

**Before Refactoring (Single File):**
- 880 lines in one file
- Repeated patterns in each game
- 4 copies of similar methods
- Hard to navigate

**After BaseGame Refactoring:**
- 850 lines (3.4% reduction)
- Single BaseGame class
- DRY principle applied

**After Module Split (Current):**
- **games/base.js**: 48 lines - Core base class
- **games/killer.js**: 161 lines - Killer game
- **games/x01.js**: 142 lines - 301 game
- **games/cricket.js**: 114 lines - Cricket game
- **games/snakes-ladders.js**: 210 lines - Snakes & Ladders
- **games/index.js**: 210 lines - Game system
- **Total**: ~885 lines across 6 focused files

### Benefits of Module Split
✅ **Each file has a single responsibility**
✅ **Easy to find specific game code**
✅ **Faster load times** (tree-shaking possible)
✅ **Better for collaboration** (less merge conflicts)
✅ **Clearer dependencies** (import/export structure)
✅ **Easier testing** (mock individual modules)

## Adding New Games

To add a new game:

1. **Create a new file: `games/my-game.js`**

2. **Extend BaseGame:**
```javascript
import { BaseGame } from './base.js';

export class MyGame extends BaseGame {
  constructor(players, options = {}) {
    super(players, 'MyGame');
    // Your game-specific setup
  }
  
  start() { /* Initialize */ }
  processThrow(segment) { /* Handle throws */ }
  nextPlayer() { /* Advance turns */ }
  render() { /* Display state */ }
}
```

3. **Import in `games/index.js`:**
```javascript
import { MyGame } from './my-game.js';
```

4. **Add case in `startGame()` function:**
```javascript
else if (selectedGameType === 'mygame') {
  currentGame = new MyGame(setupPlayers, options);
  currentGame.start();
}
```

5. **Add button in `index.html`**

6. **Add styles in `styles.css`**

That's it! Your game automatically gets player management, turn handling, and winner display.

## Module Dependencies

```
index.html
    ↓ imports
app.js + games/index.js
              ↓ imports
    games/base.js (base class)
              ↓ extended by
    ┌─────────┼─────────┬──────────────┐
killer.js  x01.js  cricket.js  snakes-ladders.js
```

