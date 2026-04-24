import fs from "fs";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { sanitize_and_print_conversation } from "../utils.js";

export async function conversation_history(conv_id) {
	if (!conv_id || !Number(conv_id)) {
		console.log("usage: /history <conv_id>");
		return;
	}

	const chat_save_dir =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const conversation_list = await fs.readdirSync(
		`${chat_save_dir}`
	);

	if (Number(conv_id) > conversation_list.length) {
		console.log("invalid user input");
		return;
	}

	const fileName = `${conversation_list[Number(conv_id) - 1]}`;
	const filePath = `${chat_save_dir}/${fileName}`;
	const conversation = fs.readFileSync(filePath);
	const parsed_conversation = JSON.parse(conversation.toString());

	sanitize_and_print_conversation(parsed_conversation);
}

