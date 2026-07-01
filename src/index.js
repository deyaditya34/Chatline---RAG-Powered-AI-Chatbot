import fs from "fs";
import { handle_command } from "./command.js";
import { parse_command } from "./utils.js";
import { read_user_input } from "./readline.js";
//import * as vector_store from "./databases/qdrant.js";
//import * as keyword_store from "./databases/elastic_search.js";
import {
	DATA_DIR,
	CONVERSATIONS_DIR,
	INTERACTIONS_DIR,
	USER_CONVERSATIONS_DIR,
	MODEL_CONVERSATIONS_DIR
} from "./config/path.js";

async function main() {
	console.log(`\x1B[38;2;255;180;180mGemini CLI\n\x1B[0m`)
	console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)

	let running = true;
	try {
		fs.readdirSync(DATA_DIR)
	} catch (err) {
		fs.mkdirSync(DATA_DIR);
	}

	try {
		fs.readdirSync(CONVERSATIONS_DIR);
	} catch (err) {
		fs.mkdirSync(CONVERSATIONS_DIR);
	}

	try {
		fs.readdirSync(USER_CONVERSATIONS_DIR);
	} catch (err) {
		fs.mkdirSync(USER_CONVERSATIONS_DIR);
	}

	try {
		fs.readdirSync(MODEL_CONVERSATIONS_DIR);
	} catch (err) {
		fs.mkdirSync(MODEL_CONVERSATIONS_DIR);
	}

	try {
		fs.readdirSync(INTERACTIONS_DIR);
	} catch (err) {
		fs.mkdirSync(INTERACTIONS_DIR);
	}

//	await vector_store.create_collection();
//	await keyword_store.create_index();

	while (running) {
		let input = await read_user_input(process.env.USER_DISPLAY_NAME);

		if (!input) continue;

		if (input.startsWith("/")) {
			const [command, args] = parse_command(input);

			await handle_command(command, args);
		}
		console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)
	}
}

main();
