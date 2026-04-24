import fs from "fs";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function delete_conversation(conv_id) {
	if (!conv_id || !Number(conv_id)) {
		console.log("usage: /delete <id>");
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

	try {
		await fs.unlinkSync(filePath);
		console.log(`conversation - '${fileName}' deleted`);
	} catch (err) {
		console.log("err in deleting file -", err);
	}
}
