#!/bin/bash

# Launch script for AutoDarts Games Dashboard Extension

echo "🎯 AutoDarts Games Dashboard"
echo "=============================="
echo ""

# Check Python version
python_cmd=""
if command -v python3 &> /dev/null; then
    python_cmd="python3"
elif command -v python &> /dev/null; then
    python_cmd="python"
else
    echo "❌ Error: Python 3 not found!"
    echo "   Please install Python 3.7 or higher"
    exit 1
fi

# Get Python version
python_version=$($python_cmd --version 2>&1 | awk '{print $2}')
echo "✅ Found Python $python_version"
echo ""

# Launch the extension
echo "🚀 Starting extension..."
$python_cmd extension.py "$@"

