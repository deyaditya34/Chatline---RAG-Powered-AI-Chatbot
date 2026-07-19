import fs from "fs";
import { handleCommand } from "./command.js";
import { parseCommand } from "./repl/utils.js";
import { readUserInput } from "./readline.js";
import * as vectorStore from "./databases/qdrant.js";
import * as keywordStore from "./databases/elastic_search.js";
import {
	dataDir,
	conversationsDir,
	interactionsDir,
	userConversationsDir,
	modelConversationsDir
} from "./config/path.js";
import { USER_DISPLAY_NAME } from "./config/env.js";

async function main(): Promise<void> {
	console.log(`\x1B[38;2;255;180;180mGemini CLI\n\x1B[0m`)
	console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)

	let running = true;
	try {
		fs.readdirSync(dataDir)
	} catch (err) {
		fs.mkdirSync(dataDir);
	}

	try {
		fs.readdirSync(conversationsDir);
	} catch (err) {
		fs.mkdirSync(conversationsDir);
	}

	try {
		fs.readdirSync(userConversationsDir);
	} catch (err) {
		fs.mkdirSync(userConversationsDir);
	}

	try {
		fs.readdirSync(modelConversationsDir);
	} catch (err) {
		fs.mkdirSync(modelConversationsDir);
	}

	try {
		fs.readdirSync(interactionsDir);
	} catch (err) {
		fs.mkdirSync(interactionsDir);
	}

	await vectorStore.createCollection();
	await keywordStore.createIndex();

	while (running) {
		let input = await readUserInput(USER_DISPLAY_NAME);

		if (!input) continue;

		if (input.startsWith("/")) {
			const [command, args] = parseCommand(input);

			await handleCommand(command, args);
		}
		console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)
	}
}

main();
