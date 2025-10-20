#!/bin/bash

# DartsHub Extension Installation Test
# This script tests if your extension is ready for DartsHub

echo "🎯 DartsHub Extension Installation Test"
echo "========================================"
echo ""

# Check required files
echo "📋 Checking required files..."
required_files=(
    "extension.py"
    "manifest.json"
    "config.ini"
    "index.html"
    "app.js"
    "styles.css"
    "games/index.js"
)

all_present=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - MISSING!"
        all_present=false
    fi
done

echo ""

# Check Python
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    echo "  ✅ $python_version"
else
    echo "  ❌ Python 3 not found!"
    all_present=false
fi

echo ""

# Check extension.py is executable
echo "🔧 Checking extension..."
if [ -x "extension.py" ]; then
    echo "  ✅ extension.py is executable"
else
    echo "  ⚠️  extension.py not executable (fixing...)"
    chmod +x extension.py
    echo "  ✅ Fixed!"
fi

echo ""

# Validate manifest.json
echo "📝 Validating manifest.json..."
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "  ✅ Valid JSON"
    name=$(python3 -c "import json; print(json.load(open('manifest.json'))['name'])")
    version=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
    echo "  📦 Extension: $name"
    echo "  🏷️  Version: $version"
else
    echo "  ❌ Invalid JSON!"
    all_present=false
fi

echo ""

# Test server start
echo "🚀 Testing server start..."
timeout 3 python3 extension.py --no-browser --port 9999 &
server_pid=$!
sleep 2

if curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/index.html | grep -q "200"; then
    echo "  ✅ Server starts successfully"
    echo "  ✅ index.html accessible"
else
    echo "  ❌ Server test failed"
    all_present=false
fi

# Clean up
kill $server_pid 2>/dev/null
wait $server_pid 2>/dev/null

echo ""
echo "========================================"
if [ "$all_present" = true ]; then
    echo "✅ Extension is ready for DartsHub!"
    echo ""
    echo "📦 To install:"
    echo "  1. Copy this folder to DartsHub extensions directory"
    echo "  2. Or symlink: ln -s $(pwd) ~/.dartshub/extensions/autodarts-games-dashboard"
    echo "  3. Restart DartsHub"
else
    echo "❌ Some checks failed. Please fix the issues above."
fi
echo ""

