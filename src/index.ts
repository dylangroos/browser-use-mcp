import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create MCP server
const server = new McpServer({
  name: "browser-use",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Tool: instruct the browser
server.tool(
  "instruct-browser",
  "Instruct the browser to navigate to a URL and return interaction history",
  {
    url: z.string().describe("The URL to navigate to"),
    instructions: z.string().describe("The instructions to follow"),
  },
  async ({ url, instructions }) => {
    const scriptPath = path.join(__dirname, "..", "src", "browser_handle.py");
    const args = [JSON.stringify({ url, instructions })];

    return new Promise((resolve, reject) => {
      const py = spawn("/Users/dylangroos/browser-use-mcp/.venv/bin/python3", [scriptPath, ...args]);

      let stdout = "";
      let stderr = "";

      py.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      py.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      py.on("close", (code) => {
        if (code !== 0) {
          return reject(
            new Error(`Python script failed with code ${code}:\n${stderr}`)
          );
        }

        try {
          const result = JSON.parse(stdout);
          if (!result.success) {
            return reject(new Error(result.error || "Unknown error"));
          }

          resolve({
            content: [
              {
                type: "text",
                text: result.result || "No result returned.",
              },
            ],
          });
        } catch (e) {
          reject(new Error("Failed to parse Python output:\n" + stdout));
        }
      });
    });
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("browser-use MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});