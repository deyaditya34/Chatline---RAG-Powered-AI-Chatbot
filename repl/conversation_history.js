import fs from "fs";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { sanitize_and_print_conversation } from "../utils.js";

export async function conversation_history(conv_id) {
	if (!conv_id || !Number(conv_id)) {
		console.log("usage: /history <conv_id>");
		return;
	}

	const conversation_list = await fs.readdirSync(
		`${process.env.STATELESS_CONV_STORAGE_DIR}`
	);

	if (Number(conv_id) > conversation_list.length) {
		console.log("invalid user input");
		return;
	}

	const fileName = `${conversation_list[Number(conv_id) - 1]}`;
	const filePath = `${process.env.STATELESS_CONV_STORAGE_DIR}/${fileName}`;
	const conversation = fs.readFileSync(filePath);
	const parsed_conversation = JSON.parse(conversation.toString());

	sanitize_and_print_conversation(parsed_conversation);
}

