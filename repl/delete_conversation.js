import fs from "fs";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { delete_document } from "../database.js";

export async function delete_conversation(conv_id) {
	if (!conv_id || !Number(conv_id)) {
		console.log("usage: /delete <id>");
		return;
	}

	const chat_save_dir_user =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const conversation_list = await fs.readdirSync(
		`${chat_save_dir_user}`
	);

	const chat_save_dir_model =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_TOKEN_BASED_SLIDING_DIR}`;

	if (Number(conv_id) > conversation_list.length) {
		console.log("invalid user input");
		return;
	}

	const fileName = `${conversation_list[Number(conv_id) - 1]}`;
	const filePath_user = `${chat_save_dir_user}/${fileName}`;
	const filePath_model = `${chat_save_dir_model}/${fileName}`;

	const file_content = fs.readFileSync(filePath_user);

	const delete_criteria = {
		must: [
			{
				key: "conversation_id",
				match: {
					value: fileName
				}
			}
		]
	}
	await delete_document(delete_criteria)

	try {
		await fs.unlinkSync(filePath_user);
		await fs.unlinkSync(filePath_model);
		console.log(`conversation - '${fileName}' deleted`);
	} catch (err) {
		console.log("err in deleting file -", err);
	}
}
