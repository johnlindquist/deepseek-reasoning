# DeepSeek Reasoning

A CLI tool that combines DeepSeek's reasoning capabilities with GPT's summarization power. This project demonstrates how to:
1. Use DeepSeek's reasoning model to analyze questions in detail
2. Stream the reasoning process in real-time
3. Use GPT to create concise, single-sentence summaries of the reasoning

## 🎓 What You'll Learn

This project is tied to an egghead.io lesson that teaches you how to:
- Extract and utilize DeepSeek's reasoning phase from their R1 model
- Stream and parse API responses in real-time
- Optimize costs by using different models for different tasks
- Combine multiple AI models in a single workflow
- Build a practical CLI tool that demonstrates these concepts

## Why This Matters

DeepSeek's R1 model provides detailed reasoning before summarization. By isolating this reasoning phase and using a faster model (like GPT-3.5-turbo) for summarization, you can:
- Get high-quality reasoning from DeepSeek
- Optimize costs by using a cheaper model for summarization
- Improve response times in your applications
- Create more efficient AI workflows

## Features
- Interactive CLI using Clack
- Real-time streaming of DeepSeek's reasoning process
- Automatic logging of all interactions
- Clean summarization of complex reasoning
- Cost-effective hybrid model approach

## Requirements

You'll need API key for:
- OpenRouter API (for GPT & DeepSeek access)

## Setup

1. Clone the repo:
```bash
git clone https://github.com/johnlindquist/deepseek-reasoning.git
cd deepseek-reasoning
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file with your API keys:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Run the CLI:
```bash
pnpm tsx index.ts
```

## How It Works

1. The CLI prompts you for a question
2. DeepSeek's reasoning model analyzes your question, streaming its thought process in real-time
3. The reasoning is captured and logged
4. GPT 3.5 creates a concise, single-sentence summary of the reasoning
5. Both the reasoning and summary are saved to timestamped log files

## Implementation Details

The code demonstrates several key patterns:
- Streaming API responses with proper TypeScript types
- Early stream termination to capture only reasoning content
- Efficient model switching for cost optimization
- Structured logging for debugging and analysis
- Clean CLI interactions with proper error handling

## Tech Stack
- TypeScript
- OpenAI SDK (for OpenRouter)
- Clack (for CLI interactions)
- dotenv (for environment management) 