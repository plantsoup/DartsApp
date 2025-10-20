# AutoDarts Games Dashboard - DartsHub Extension

A feature-rich web-based gaming platform for AutoDarts with multiple game modes, beautiful animations, and an intuitive interface.

## 🎯 Features

- **4 Game Modes**: Killer, 301, Cricket, Snakes & Ladders
- **2-8 Players**: Support for multiple players
- **Real-time Updates**: WebSocket connection to AutoDarts
- **Beautiful UI**: FlightClub-inspired design with smooth animations
- **Configurable**: Customizable game options
- **Web-Based**: Access from any device on your network

## 📦 Installation

### Via DartsHub (Recommended)

1. Open DartsHub
2. Go to Extensions
3. Search for "AutoDarts Games Dashboard"
4. Click Install
5. Start the extension

### Manual Installation

1. Clone or download this repository
2. Place in your DartsHub extensions folder
3. Install dependencies (none required!)
4. Run `python extension.py`

## 🚀 Quick Start

### Starting the Extension

```bash
# Start with default settings
python extension.py

# Start on a different port
python extension.py --port 8000

# Start without opening browser
python extension.py --no-browser

# Show version information
python extension.py --version
```

### First Time Setup

1. Extension starts automatically and opens your browser
2. Click the ⚙️ Settings button
3. Enter your AutoDarts server IP address (e.g., `192.168.0.224`)
4. Enter the port (usually `3180`)
5. Click "Save & Reconnect"
6. You're ready to play!

## 🎮 Games

### Killer
- 2-8 players
- Each player gets a random number
- Hit your number to become a "Killer"
- Eliminate opponents by hitting their numbers
- Configurable: lives (1-5), hits to killer (1-3)

### 301
- Classic race to zero
- Live scoring and averages
- Checkout range highlighting
- Optional double-out
- Turn-by-turn statistics

### Cricket
- Standard cricket (15-20 + Bull)
- Visual mark tracking (/, //, X)
- Points scoring
- Animated marks
- Auto-win detection

### Snakes & Ladders
- Race to space 100
- Visual 10x10 board
- 12 snakes, 10 ladders
- Animated player movement
- Colored player markers

## ⚙️ Configuration

### config.ini Options

```ini
[SETTINGS]
port = 8080                    # Web server port
auto_open_browser = true       # Auto-open browser on start
autodarts_host = 192.168.0.224 # Your AutoDarts IP
autodarts_port = 3180          # AutoDarts port
protocol = ws                  # ws or wss

[KILLER_DEFAULTS]
starting_lives = 3             # Default lives (1-5)
hits_to_killer = 1             # Hits needed to become killer

[X01_DEFAULTS]
starting_score = 301           # Starting score
double_out = false             # Require double to finish
```

### Web UI Settings

All game settings can be configured through the web interface:
- Click ⚙️ Settings for connection config
- Game options appear when starting a new game

## 🌐 Network Access

### Local Access
- Access at: `http://localhost:8080`
- Works on the same computer as the extension

### Network Access
- Find your computer's IP (e.g., `192.168.0.100`)
- Access from any device: `http://192.168.0.100:8080`
- Great for tablets/phones as remote displays!

## 🛠️ Requirements

- **Python**: 3.7 or higher
- **AutoDarts**: v2.0.0 or higher
- **Browser**: Modern browser with WebSocket support
- **Network**: AutoDarts server must be accessible

No external Python packages required!

## 📝 Troubleshooting

### Connection Issues

**"Can't connect to AutoDarts"**
- Check IP address in Settings
- Verify AutoDarts is running
- Ensure port 3180 is accessible
- Try using `ws://` protocol

**"Mixed Content Error"**
- Access via HTTP not HTTPS
- Use `http://localhost:8080`
- If using network IP, use `http://` not `https://`

### Port Issues

**"Port already in use"**
```bash
# Use a different port
python extension.py --port 8888
```

### Browser Issues

**"Modules not loading"**
- Make sure you're accessing via the web server
- Don't open `index.html` directly
- Use `http://localhost:8080/index.html`

## 🔄 Updates

The extension checks for updates automatically through DartsHub.

To manually update:
```bash
cd /path/to/extension
git pull
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - Free to use and modify

## 👥 Credits

- Built for the AutoDarts community
- Inspired by FlightClub Darts
- Uses AutoDarts WebSocket API

## 📧 Support

- Issues: GitHub Issues
- Discussions: AutoDarts Discord
- Email: support@dartsapp.io

## 🎯 Changelog

### v1.0.0 (Current)
- Initial release
- 4 game modes (Killer, 301, Cricket, Snakes & Ladders)
- Web-based interface
- Real-time WebSocket connection
- Configurable game options
- Beautiful animations
- Multi-player support (2-8 players)
- Settings persistence

---

**Enjoy playing! 🎯**

