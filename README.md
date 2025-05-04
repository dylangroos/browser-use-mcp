# Browser-Use MCP

A Model Context Protocol server that provides browser automation capabilities.

## Features

This MCP server provides a tool for browser automation:

### instruct-browser

This tool allows you to navigate to a URL and perform browser actions according to provided instructions.

**Parameters:**
- `url` (string): The URL to navigate to
- `instructions` (string): The instructions to follow in the browser

**Example:**
```json
{
  "url": "https://example.com",
  "instructions": "Search for 'climate change' and extract the first three results"
}
```

**Returns:**
A text summary of the browser interaction history and results.

The tool leverages the `browser-use` library with Google's Gemini model to perform intelligent browser automation.

## Docker Setup

### Building the Docker Image

Build the Docker image with:

```bash
docker build -t mcp/browser-use .
```

### Running the Container

Run the MCP server in a Docker container:

```bash
docker run -i --rm --init -e DOCKER_CONTAINER=true mcp/browser-use
```

### Using with Custom Environment Variables

If you need to provide API keys or other environment variables:

```bash
docker run -i --rm --init \
  -e GOOGLE_API_KEY=your_api_key \
  -e DOCKER_CONTAINER=true \
  mcp/browser-use
```

### Development Mode

For development with volume mounting:

```bash
docker run -i --rm --init \
  -e DOCKER_CONTAINER=true \
  -v $(pwd):/app \
  mcp/browser-use
```

## MCP Configuration

Add this configuration to your MCP-compatible client:

```json
{
  "mcp": {
    "servers": {
      "browser-use": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "groos12/browser-use-mcp"]
      }
    }
  }
}
```

## Publishing to Container Registry

For cleaner integration and distribution, this project publishes Docker images to container registries.

### Option 1: GitHub Container Registry (GHCR)

This repository is configured with GitHub Actions workflows to automatically build and publish the image to GitHub Container Registry.

To use the pre-built image from GHCR:

```json
{
  "mcp": {
    "servers": {
      "browser-use": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "ghcr.io/YOUR_USERNAME/browser-use-mcp"]
      }
    }
  }
}
```

### Option 2: Docker Hub

This repository is configured with GitHub Actions to automatically build and push to Docker Hub.

The image is available at: `groos12/browser-use-mcp`

You can pull it directly:

```bash
docker pull groos12/browser-use-mcp
```

Alternatively, you can build and push manually:

1. Build the image locally:
   ```bash
   docker build -t groos12/browser-use-mcp .
   ```

2. Log in to Docker Hub:
   ```bash
   docker login
   ```

3. Push the image:
   ```bash
   docker push groos12/browser-use-mcp
   ```

## Notes

- The Docker container includes Chromium for headless browser automation
- Make sure any required API keys are provided as environment variables
- **Required Environment Variables:**
  - `GOOGLE_API_KEY`: API key for Google Generative AI (Gemini model)
  
## Dependencies

This project uses:
- [browser-use](https://github.com/browser-use/browser-use) - Browser automation library
- [langchain-google-genai](https://python.langchain.com/docs/integrations/chat/google_generative_ai) - LangChain integration for Google's Generative AI
- [Model Context Protocol SDK](https://github.com/model-context-protocol/sdk) - MCP implementation
