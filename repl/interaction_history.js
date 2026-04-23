import fs from "fs";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { sanitize_and_print_interaction } from "../utils.js";

export async function interaction_history(interaction_id) {
	if (!interaction_id || !Number(interaction_id)) {
		console.log("usage: to be implemented later based on the repl structure");
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
	const interaction = fs.readFileSync(filePath);
	const parsed_interaction = JSON.parse(interaction.toString());

	sanitize_and_print_interaction(parsed_interaction);
}
