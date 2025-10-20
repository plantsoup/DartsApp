#!/usr/bin/env python3

"""
DartsHub Extension - AutoDarts Games Dashboard
A web-based gaming platform for AutoDarts
"""

import http.server
import socketserver
import os
import sys
import json
import argparse
import webbrowser
from pathlib import Path

VERSION = "1.0.0"
PORT = 8080

class DartsAppHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve the DartsApp"""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)
    
    def log_message(self, format, *args):
        """Override to provide better logging"""
        sys.stdout.write("%s - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))

def start_server(port=PORT, open_browser=True):
    """Start the web server for the DartsApp"""
    
    print(f"🎯 Starting AutoDarts Games Dashboard v{VERSION}")
    print(f"📡 Server starting on port {port}...")
    
    try:
        with socketserver.TCPServer(("", port), DartsAppHandler) as httpd:
            print(f"✅ Server running at http://localhost:{port}")
            print(f"📱 Access the dashboard at: http://localhost:{port}/index.html")
            print("\n🎮 Available Games:")
            print("   - Killer")
            print("   - 301")
            print("   - Cricket")
            print("   - Snakes & Ladders")
            print("\n⚙️  Configure your AutoDarts connection in Settings")
            print("\n💡 Press Ctrl+C to stop the server\n")
            
            # Open browser automatically
            if open_browser:
                webbrowser.open(f"http://localhost:{port}/index.html")
            
            # Serve forever
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down server...")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {port} is already in use!")
            print(f"   Try a different port with: python extension.py --port <number>")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

def get_version():
    """Return version information"""
    return {
        "version": VERSION,
        "name": "AutoDarts Games Dashboard",
        "author": "DartsApp",
        "description": "Web-based gaming platform for AutoDarts with multiple game modes"
    }

def main():
    """Main entry point for the extension"""
    
    parser = argparse.ArgumentParser(
        description="AutoDarts Games Dashboard - A DartsHub Extension"
    )
    parser.add_argument(
        '--port',
        type=int,
        default=PORT,
        help=f'Port to run the server on (default: {PORT})'
    )
    parser.add_argument(
        '--no-browser',
        action='store_true',
        help='Do not open browser automatically'
    )
    parser.add_argument(
        '--version',
        action='store_true',
        help='Show version information'
    )
    
    args = parser.parse_args()
    
    if args.version:
        info = get_version()
        print(json.dumps(info, indent=2))
        sys.exit(0)
    
    start_server(port=args.port, open_browser=not args.no_browser)

if __name__ == "__main__":
    main()

