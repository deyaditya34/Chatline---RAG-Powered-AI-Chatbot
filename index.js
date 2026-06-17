import fs from "fs";
import dotenv from "dotenv";
import { handle_command } from "./command.js";
import { parse_command } from "./utils.js";
import { read_user_input } from "./readline.js";
import user_prompts from "./prompts/default_user_prompts.json" with {type: "json"};
import * as qdrant from "./databases/qdrant.js";
import * as elastic_search from "./databases/elastic_search.js";

dotenv.config();

async function main() {
	console.log(`\x1B[38;2;255;180;180mGemini CLI\n\x1B[0m`)
	console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)

	let running = true;
	try {
		fs.readdirSync(`${process.env.CONV_STORAGE_DIR}`)
	} catch (err) {
		fs.mkdirSync(`${process.env.CONV_STORAGE_DIR}`);
	}

	try {
		fs.readdirSync(
			`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`);
	} catch (err) {
		fs.mkdirSync(`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`);
	}

	try {
		fs.readdirSync(
			`${process.env.CONV_STORAGE_DIR}/${process.env.INTERACTION_CONV_STORAGE_DIR}`);
	} catch (err) {
		fs.mkdirSync(`${process.env.CONV_STORAGE_DIR}/${process.env.INTERACTION_CONV_STORAGE_DIR}`);
	}

	try {
		fs.readdirSync(
			`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_TOKEN_BASED_SLIDING_DIR}`);
	} catch (err) {
		fs.mkdirSync(
			`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_TOKEN_BASED_SLIDING_DIR}`);
	}

	await qdrant.create_collection(process.env.DATABASE_COLLECTION_NAME);
	await elastic_search.create_index(process.env.ELASTIC_DB_COLLECTION_NAME);

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
