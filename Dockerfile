FROM python:3.11-slim

WORKDIR /app

# Copy application files
COPY . .

# Expose port
EXPOSE 8080

# Run the server
CMD ["python", "extension.py", "--port", "8080", "--no-browser"]

