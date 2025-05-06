# Browser-Use MCP Server

A Model Context Protocol server that provides browser automation capabilities.

## MCP Configuration

Add this configuration to your MCP-compatible client:

```json
{
  "mcpServers":{
      "browser-use": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "groos12/browser-use-mcp"]
      }
    }
}
```

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
