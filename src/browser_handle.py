import sys
import json
import asyncio
from browser_use import Agent
from langchain_google_genai import ChatGoogleGenerativeAI

async def browser_instruct(url: str, instructions: str) -> str:
    task = f"Navigate to {url} and {instructions}"
    agent = Agent(
        task=task,
        llm=ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    )
    history = await agent.run()
    # what part of this do we want to return to the agent?
    result = history.final_result()
    return result

async def main():
    try:
        args = json.loads(sys.argv[1])
        result = await browser_instruct(args["url"], args["instructions"])
        print(json.dumps({ "success": True, "result": result }))
    except Exception as e:
        print(json.dumps({ "success": False, "error": str(e) }))

if __name__ == "__main__":
    asyncio.run(main())