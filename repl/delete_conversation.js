import fs from "fs";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function delete_conversation(conv_id) {
	if (!conv_id || !Number(conv_id)) {
		console.log("usage: /delete <id>");
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

	try {
		await fs.unlinkSync(filePath);
		console.log(`conversation - '${fileName}' deleted`);
	} catch (err) {
		console.log("err in deleting file -", err);
	}
}
