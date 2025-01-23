import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { appendFile } from "node:fs/promises";
import ora from "ora";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			OPENROUTER_API_KEY: string;
			DEEPSEEK_API_KEY: string;
		}
	}
}

const openai = new OpenAI({
	baseURL: "https://api.deepseek.com",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

const spinner = ora("Thinking...").start();

const response = await openai.chat.completions.create({
	model: "deepseek-reasoner",
	messages: [{ role: "user", content: "What's better, Taco or Burrito?" }],
});

const reasoning = (
	response.choices[0]?.message as unknown as { reasoning_content: string }
).reasoning_content;

spinner.succeed("Done!");
console.log(reasoning);

await appendFile(
	"response.log",
	`\n\n${new Date().toISOString()}\n\n${JSON.stringify(response, null, 2)}`,
);
