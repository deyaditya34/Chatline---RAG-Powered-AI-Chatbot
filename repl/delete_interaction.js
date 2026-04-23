import fs from "fs";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function delete_interaction(interaction_id) {
	if (!interaction_id || !Number(interaction_id)) {
		console.log("usage: /delete <id>");
		return;
	}

	const interaction_list = await fs.readdirSync(
		`${process.env.INTERACTION_CONV_STORAGE_DIR}`
	);

	if (Number(interaction_id) > interaction_list.length) {
		console.log("invalid user input");
		return;
	}

	const fileName = `${interaction_list[Number(interaction_id) - 1]}`;
	const filePath = `${process.env.INTERACTION_CONV_STORAGE_DIR}/${fileName}`;

	try {
		await fs.unlinkSync(filePath);
		console.log(`interaction - '${fileName}' deleted`);
	} catch (err) {
		console.log("err in deleting file -", err);
	}
}
