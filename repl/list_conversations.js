import fs from "fs";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { print_list } from "../utils.js";

export async function list_conversation() {
	const chat_save_dir =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const conversation_list = await fs.readdirSync(
		`${chat_save_dir}`
	);

	if (!conversation_list.length) {
		console.log("no existing conversation found");
		return;
	}
	print_list(conversation_list);
}

