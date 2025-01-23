# DeepSeek Reasoning

A CLI tool that combines DeepSeek's reasoning capabilities with GPT's summarization power. This project demonstrates how to:
1. Use DeepSeek's reasoning model to analyze questions in detail
2. Stream the reasoning process in real-time
3. Use GPT to create concise, single-sentence summaries of the reasoning

## Features
- Interactive CLI using Clack
- Real-time streaming of DeepSeek's reasoning process
- Automatic logging of all interactions
- Clean summarization of complex reasoning

## Requirements

You'll need API keys for:
- DeepSeek API
- OpenRouter API (for GPT access)

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
DEEPSEEK_API_KEY=your_deepseek_api_key
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

## Tech Stack
- TypeScript
- OpenAI SDK (for both DeepSeek and OpenRouter)
- Clack (for CLI interactions)
- dotenv (for environment management) 