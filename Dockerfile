FROM node:20-slim

WORKDIR /app

# Install Python and browser dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Copy Node.js files and install dependencies
COPY package*.json ./
RUN npm ci

# Set up Python virtual environment
RUN python3 -m venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install patchright and ensure Chromium is installed
RUN pip install --no-cache-dir patchright
RUN patchright install chromium

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# Set environment variable (for production use set this via -e flag)
ENV NODE_ENV=production

# Run the MCP server when the container starts
ENTRYPOINT ["node", "build/index.js"]