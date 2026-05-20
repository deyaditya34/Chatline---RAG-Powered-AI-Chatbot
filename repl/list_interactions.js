import fs from "fs";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { print_list } from "../utils.js";

export async function list_interaction() {
	const chat_save_dir =
		`${process.env.CONV_STORAGE_DIR}/${process.env.INTERACTION_CONV_STORAGE_DIR}`;

	const interaction_list = await fs.readdirSync(
		`${chat_save_dir}`
	);

	if (!interaction_list.length) {
		console.log("no existing interaction found");
		return;
	}

	print_list(interaction_list);
}
