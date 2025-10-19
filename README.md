# 🎯 AutoDarts Dashboard

A modern, interactive dashboard for AutoDarts with support for dart games like Killer.

## 📁 File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── app.js          # WebSocket connection & dartboard rendering
├── games.js        # Game system & Killer game logic
└── README.md       # This file
```

## 🚀 Getting Started

### Requirements
- A local web server (required for ES6 modules)
- AutoDarts running on your network

### Running the Dashboard

Since this project uses ES6 modules, you need to serve it from a web server. Here are a few options:

#### Option 1: Python (if installed)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

#### Option 2: Node.js (if installed)
```bash
# Install http-server globally
npm install -g http-server

# Run it
http-server -p 8000
```

Then open: `http://localhost:8000`

#### Option 3: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Configuration

Edit the WebSocket URL in `app.js` if your AutoDarts is on a different IP:
```javascript
const url = "ws://YOUR_AUTODARTS_IP:3180/api/events";
```

## 🎮 Features

### Dashboard
- **Real-time WebSocket connection** to AutoDarts
- **Visual dartboard** with live dart positions
- **Motion detection indicators** (dart in frame, hand detection, etc.)
- **System stats** (FPS for each camera, resolution)
- **Event logging** with timestamps

### Killer Game
- Add 2-8 players
- Each player assigned a unique number
- Hit your number to become a "Killer"
- Eliminate other players by hitting their numbers
- 3 lives per player
- Automatic turn management
- Winner celebration

## 🎯 How to Play Killer

1. Click **"New Game"**
2. Add players (minimum 2, maximum 8)
3. Click **"Start Game"**
4. Each player takes turns:
   - First, hit your assigned number to become a "KILLER"
   - Once a killer, hit other players' numbers to eliminate them
   - Each hit removes one life (3 lives total)
5. Remove your darts from the board to end your turn
6. Last player standing wins!

## 🔮 Coming Soon

- **301 Game** - Race to zero from 301
- **Cricket** - Close numbers 15-20 and bullseye
- Score tracking and statistics
- Player profiles
- Game history

## 🛠️ Development

### Adding New Games

To add a new game, edit `games.js`:

1. Create a new game class (similar to `KillerGame`)
2. Update the game selection in `startGame()` function
3. Enable the game button in `index.html`

### Modifying Styles

All styles are in `styles.css` with clear section comments:
- Base styles
- Modal styles
- Game board styles
- Animations

## 📝 Notes

- The dashboard automatically reconnects if the WebSocket connection drops
- All game events are logged in the event log at the bottom
- The dartboard shows up to 3 darts with different colors per throw

## 🐛 Troubleshooting

**Issue**: "CORS error" or modules not loading
**Solution**: Make sure you're using a web server (see "Running the Dashboard" above)

**Issue**: Can't connect to AutoDarts
**Solution**: Check that the IP address in `app.js` matches your AutoDarts setup

**Issue**: Game doesn't advance to next player
**Solution**: Make sure to remove darts from the board (trigger "Takeout finished" event)

## 📄 License

Free to use and modify!

