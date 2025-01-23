import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { appendFile } from "node:fs/promises";
import { text, spinner, log } from "@clack/prompts";

const s = spinner();

const DATE = new Date().toISOString().split("T")[0];
const LOG_FILE = `logs/${DATE}.log`;

const appendLog = async (data: unknown) =>
	appendFile(LOG_FILE, JSON.stringify(data, null, 2));

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			OPENROUTER_API_KEY: string;
			DEEPSEEK_API_KEY: string;
		}
	}
}

const deepseek = new OpenAI({
	baseURL: "https://api.deepseek.com",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

const question = (await text({
	message: "How can I help?",
})) as string;

s.start("Thinking...");
const response = await deepseek.chat.completions.create({
	model: "deepseek-reasoner",
	messages: [{ role: "user", content: question }],
});

const reasoning = (
	response.choices[0]?.message as unknown as { reasoning_content: string }
).reasoning_content;

s.stop();

log.info(`${reasoning.slice(0, 100)}...`);

await appendLog(response);

s.start("Summarizing...");

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPENROUTER_API_KEY,
});

const completion = await openai.chat.completions.create({
	model: "openai/gpt-3.5-turbo-0613",
	messages: [
		{
			role: "system",
			content:
				"Answer the initial question in a single sentence based on the <REASONING>",
		},
		{
			role: "user",
			content: `
<QUESTION>
${question}
</QUESTION>

<REASONING>
${reasoning}
</REASONING>
`,
		},
	],
});

log.info(completion.choices[0]?.message.content || "Failed to summarize...");
s.stop();

await appendLog(completion);
