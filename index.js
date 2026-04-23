import fs from "fs";
import dotenv from "dotenv";
import { handle_command } from "./command.js";
import { parse_command } from "./utils.js";
import { read_user_input } from "./readline.js";
import user_prompts from "./prompts/default_user_prompts.json" with {type: "json"};

dotenv.config();

async function main() {
	console.log(`\x1B[38;2;255;180;180mGemini CLI\n\x1B[0m`)
	console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)

	let running = true;

	try {
		fs.readdirSync(
			`${process.env.STATELESS_CONV_STORAGE_DIR}`);
	} catch (err) {
		fs.mkdirSync(`${process.env.STATELESS_CONV_STORAGE_DIR}`);
	}

	try {
		fs.readdirSync(
			`${process.env.INTERACTION_CONV_STORAGE_DIR}`);
	} catch (err) {
		fs.mkdirSync(`${process.env.INTERACTION_CONV_STORAGE_DIR}`);
	}

	while (running) {
		let input = await read_user_input(process.env.USER_DISPLAY_NAME);

		if (!input) continue;

		if (input.startsWith("/")) {
			const [command, args] = parse_command(input);

			await handle_command(command, args);
		}
	}
}

main();
