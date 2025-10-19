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

Since this project uses ES6 modules, you need to serve it from a web server. You have multiple hosting options:

#### Option 1: Python (if installed)
```bash
cd /path/to/DartsApp
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

#### Option 2: Node.js (if installed)
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run it
cd /path/to/DartsApp
http-server -p 8080
```

Then open: `http://localhost:8080`

#### Option 3: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Cloudflare Pages / GitHub Pages
1. Push your code to GitHub
2. Deploy to Cloudflare Pages, Netlify, or GitHub Pages
3. Configure settings to use **wss://** protocol (see Configuration below)

### Configuration

1. Click the **⚙️ Settings** button in the header
2. Select the protocol:
   - **ws://** - For local hosting (HTTP) with standard AutoDarts setup
   - **wss://** - For HTTPS hosting (Cloudflare Pages, etc.) or if using AutoDarts cloud relay
3. Enter your AutoDarts server IP address or hostname
4. Enter the port (usually `3180`)
5. Click **Save & Reconnect**

**Note:** When hosting on HTTPS (like Cloudflare Pages), you'll need to use `wss://` protocol. This requires either:
- AutoDarts cloud relay service
- Setting up SSL/TLS on your local AutoDarts server
- Using a VPN or reverse proxy with SSL

Your settings are automatically saved in browser localStorage and will persist between sessions.

## 🎮 Features

### Dashboard
- **Real-time WebSocket connection** to AutoDarts
- **Visual dartboard** with live dart positions
- **Motion detection indicators** (dart in frame, hand detection, etc.)
- **Configurable connection settings** (IP address & port)
- **Settings persistence** via localStorage

### Killer Game
- Add 2-8 players
- **Configurable game options:**
  - Starting lives (1-5)
  - Hits required to become killer (1-3)
- Each player assigned a random unique number
- Hit your number to become a "Killer"
- Eliminate other players by hitting their numbers
- Progress tracking for becoming killer
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
- The dartboard shows up to 3 darts with different colors per throw
- Connection settings are saved in your browser and persist between sessions

## 🐛 Troubleshooting

**Issue**: "CORS error" or modules not loading  
**Solution**: Make sure you're using a web server (see "Running the Dashboard" above)

**Issue**: "Mixed Content" or "Insecure WebSocket" error  
**Solution**: In Settings, switch protocol to **wss://** if accessing via HTTPS, or use **ws://** if accessing via HTTP (localhost).

**Issue**: Can't connect to AutoDarts  
**Solution**: Click ⚙️ Settings and verify your AutoDarts IP address and port are correct

**Issue**: Game doesn't advance to next player  
**Solution**: Make sure to remove darts from the board (trigger "Takeout finished" event)

**Issue**: Settings aren't saving  
**Solution**: Make sure your browser allows localStorage (check privacy/cookie settings)

## 📄 License

Free to use and modify!

