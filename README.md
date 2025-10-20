# 🎯 AutoDarts Games Dashboard

A modern, feature-rich web-based gaming platform for AutoDarts. Available as a standalone app or DartsHub extension.

## 📁 File Structure

```
├── index.html           # Main HTML structure
├── styles.css           # All styling and animations
├── app.js               # WebSocket connection & dartboard rendering
├── games/               # Modular game system
│   ├── index.js         # Game manager & exports
│   ├── base.js          # Base game class
│   ├── killer.js        # Killer game
│   ├── x01.js           # 301 game
│   ├── cricket.js       # Cricket game
│   └── snakes-ladders.js # Snakes & Ladders game
├── README.md            # This file
└── ARCHITECTURE.md      # Technical documentation
```

## 🚀 Getting Started

### Requirements
- A local web server (required for ES6 modules)
- AutoDarts running on your network

### Running the Dashboard

**⚠️ Important:** This app must be served over **HTTP** (not HTTPS) to connect to local AutoDarts servers, since browsers block insecure WebSocket connections from HTTPS pages.

Since this project uses ES6 modules, you need to serve it from a web server. Here are your options:

**Python:**
```bash
cd /path/to/DartsApp
python3 -m http.server 8080
# Or use the extension launcher
python3 extension.py
```

Then open: `http://localhost:8080`

**Node.js:**
```bash
npm install -g http-server
cd /path/to/DartsApp
http-server -p 8080
```

**VS Code Live Server:**
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Configuration

1. Click the **⚙️ Settings** button in the header
2. Enter your AutoDarts server IP address (e.g., `192.168.0.224`)
3. Enter the port (usually `3180`)
4. Click **Save & Reconnect**

Your settings are automatically saved in browser localStorage and will persist between sessions.

## 🎮 Features

### Dashboard
- **Real-time WebSocket connection** to AutoDarts
- **Visual dartboard** with live dart positions
- **Motion detection indicators** (dart in frame, hand detection, etc.)
- **Configurable connection settings** (IP address & port)
- **Settings persistence** via localStorage

### Games

**Killer**
- Add 2-8 players
- Configurable options: Starting lives (1-5), Hits to become killer (1-3)
- Each player assigned a random number
- Hit your number to become a "Killer"
- Eliminate others by hitting their numbers
- Progress tracking and automatic turn management

**301**
- Classic race to zero from 301 points
- Optional double-out finish
- Live score tracking with animations
- Real-time 3-dart average calculation
- Checkout range highlighting (< 170)
- Turn-by-turn score display
- Highest score tracking

**Cricket**
- Standard cricket (15-20 and Bull)
- Visual mark tracking with animations
- Points scoring for closed numbers
- Auto-detect winner when all numbers closed
- Beautiful mark animations (/, //, X)

**Snakes & Ladders**
- Race to space 100 on a visual game board
- Each dart score moves you forward
- 12 snakes that slide you down
- 10 ladders that boost you up
- Live board with colored player markers
- Animated player movement
- Snake pattern board layout (authentic feel)
- Finish space pulses with golden animation

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

## 🎨 Visual Features

**FlightClub-Inspired Design:**
- Smooth animations and transitions
- Glowing effects on active players
- Score pulse animations
- Checkout range highlighting
- Winner celebration with color-shifting effects
- Turn indicators with glow animations
- Mark animations in Cricket
- Player bounce animations in Snakes & Ladders
- Color-coded snake (red) and ladder (green) spaces
- Responsive design with gradient backgrounds

## 🔮 Coming Soon

- **Around the Clock** - Hit 1-20 in order
- **Shanghai** - Hit single, double, triple
- **501 variant**
- Sound effects
- Player statistics and history
- Game replays

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
- The dartboard shows up to 3 darts with different colors per throw
- Connection settings are saved in your browser and persist between sessions

## 📦 Extension Files

- `extension.py` - Python launcher for DartsHub
- `config.ini` - Extension configuration
- `manifest.json` - Extension metadata
- `requirements.txt` - Python dependencies (none!)
- `launch.sh` - Quick launch script
- `EXTENSION_README.md` - Detailed extension docs

## 🌐 Network Access

### Local Access
Access on the same computer:
```
http://localhost:8080
```

### Network Access
Access from other devices on your network:
1. Find your computer's IP (e.g., `192.168.0.100`)
2. Access from any device: `http://192.168.0.100:8080`
3. Perfect for tablets/phones as remote displays!

## 🐛 Troubleshooting

**Issue**: "CORS error" or modules not loading  
**Solution**: Make sure you're using a web server (not opening `index.html` directly)

**Issue**: "Mixed Content" or "Insecure WebSocket" error  
**Solution**: Access the app via HTTP (not HTTPS). If using Cloudflare Pages or similar, run it locally instead.

**Issue**: Can't connect to AutoDarts  
**Solution**: Click ⚙️ Settings and verify your AutoDarts IP address and port are correct

**Issue**: Game doesn't advance to next player  
**Solution**: Make sure to remove darts from the board (trigger "Takeout finished" event)

**Issue**: Settings aren't saving  
**Solution**: Make sure your browser allows localStorage (check privacy/cookie settings)

## 📄 License

Free to use and modify!

