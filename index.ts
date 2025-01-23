import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { appendFile } from "node:fs/promises";
import { text, spinner, log } from "@clack/prompts";

const s = spinner();
const timestamp = new Date()
	.toISOString()
	.replace("T", "-")
	.replace(/:/g, "-")
	.split(".")[0];
const logFile = `logs/${timestamp}.log`;

const appendLog = async (data: unknown) =>
	appendFile(logFile, `---\n\n${JSON.stringify(data, null, 2)}\n\n`);

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			OPENROUTER_API_KEY: string;
			DEEPSEEK_API_KEY: string;
		}
	}
}

const question = (await text({
	message: "How can I help?",
})) as string;

log.info("Thinking...");
const deepseek = new OpenAI({
	baseURL: "https://api.deepseek.com",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

const deepseekResponse = await deepseek.chat.completions.create({
	model: "deepseek-reasoner",
	messages: [{ role: "user", content: question }],
	stream: true,
});

let reasoning = "";

for await (const chunk of deepseekResponse) {
	const reasoningContent = (
		chunk.choices?.[0]?.delta as { reasoning_content: string }
	)?.reasoning_content;

	if (reasoningContent !== null) {
		const content = reasoningContent;
		reasoning += content;
		process.stdout.write(content);
	} else {
		log.success("Reasoning done!");
		deepseekResponse.controller.abort(); // stop the stream before it summarizes
	}
}

await appendLog(`
REASONING:
${reasoning}
---------
`);

s.start("Summarizing...");
const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPENROUTER_API_KEY,
});

const gptResponse = await openai.chat.completions.create({
	model: "openai/gpt-3.5-turbo-0613",
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
