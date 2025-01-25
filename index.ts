import dotenv from "dotenv";
dotenv.config();

import { log, spinner, text } from "@clack/prompts";
import { existsSync } from "node:fs";
import { appendFile, mkdir } from "node:fs/promises";
import OpenAI from "openai";

const OPEN_ROUTER_API_URL = "https://openrouter.ai/api/v1";
const REASON_MODEL = 'google/gemini-2.0-flash-thinking-exp:free'
const SUMMARIZER_MODEL = 'openai/gpt-4o-mini'
const s = spinner();
const timestamp = new Date()
	.toISOString()
	.replace("T", "-")
	.replace(/:/g, "-")
	.split(".")[0];
const logFile = `logs/${timestamp}.log`;

const appendLog = async (data: unknown) => {
	if (!existsSync("logs")) {
		await mkdir("logs");
	}
	appendFile(logFile, `---\n\n${JSON.stringify(data, null, 2)}\n\n`);
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			OPENROUTER_API_KEY: string;
		}
	}
}

const question = (await text({
	message: "How can I help?",
})) as string;

log.info("Thinking...");
const deepseek = new OpenAI({
	baseURL: OPEN_ROUTER_API_URL,
	apiKey: process.env.OPENROUTER_API_KEY,
});

const deepseekResponse = await deepseek.chat.completions.create({
	model: REASON_MODEL,
	messages: [{ role: "user", content: question }],
	stream: true,
	include_reasoning: true, // not in types yet
});

let reasoning = "";

for await (const chunk of deepseekResponse) {
	const reasoningContent = (
		chunk.choices?.[0]?.delta as { reasoning: string }
	)?.reasoning;

	if (reasoningContent !== null) {
		const content = reasoningContent;
		reasoning += content;
		process.stdout.write(content);
	} else {
		deepseekResponse.controller.abort(); // stop the stream before it summarizes
		log.success("Reasoning done!");
		break;
	}
}

await appendLog(`
REASONING:
${reasoning}
---------
`);

s.start("Summarizing...");
const openai = new OpenAI({
	baseURL: OPEN_ROUTER_API_URL,
	apiKey: process.env.OPENROUTER_API_KEY,
});

const gptResponse = await openai.chat.completions.create({
	model: SUMMARIZER_MODEL,
	messages: [
		{
			role: "system",
			content:
				"Answer the initial <QUESTION> in a single sentence based on the <REASONING>",
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

const summary = gptResponse.choices[0]?.message.content ?? "";

s.stop();
log.info(summary);

await appendLog(`
SUMMARY:
${summary}
---------
`);
