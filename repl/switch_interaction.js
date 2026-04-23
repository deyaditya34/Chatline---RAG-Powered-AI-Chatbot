import fs from "fs";
import { parse_command } from "../utils.js";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import {
	sanitize_interaction, sanitize_and_print_interaction,
	print_output, parse_prev_model_response_id
} from "../utils.js";
import { create_new_interaction, generate_content_using_http } from "../ai_model.js";

export async function switch_interaction(interaction_id) {
	let user_response;
	let model_response;
	let prev_model_version;
	let prev_model_response_id;

	if (!interaction_id) {
		console.log("usage: /switch <id>");
		return;
	}

	const interaction_list = await fs.readdirSync(
		`${process.env.INTERACTION_CONV_STORAGE_DIR}`
	);

	const fileNo = Number(interaction_id) - 1;

	if (fileNo > interaction_list.length - 1 || !Number(interaction_id)) {
		console.log("invalid input");
		return;
	}

	const fileName = interaction_list[fileNo];
	const interaction_history = fs.readFileSync(
		`${process.env.INTERACTION_CONV_STORAGE_DIR}/${fileName}`
	);
	const parsed_interaction_history = JSON.parse(interaction_history.toString());
	prev_model_response_id = parse_prev_model_response_id(parsed_interaction_history);
	sanitize_and_print_interaction(parsed_interaction_history);

	while (true) {
		process.stdout.write("\x1B[38;2;255;180;180m");
		user_response = await read_user_input(
			process.env.USER_CONV_DISPLAY_NAME
		);
		process.stdout.write("\x1B[0m");

		if (input.startsWith("/")) {
			const [command, args] = parse_command(user_response);

			await handle_command(command, args);
			break;
		};

		const sanitize_user_response = sanitize_interaction(user_response, "user");
		parsed_interaction_history.outputs.push(sanitize_user_response);

		prev_model_version = parsed_interaction_history.model_version;
		let [model_response, model_version, model_response_id] =
			await create_new_interaction(user_response, prev_model_response_id);

		prev_model_response_id = model_response_id;
		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversations");

		if (model_response) {
			const sanitize_model_response = sanitize_interaction(model_response, "model");
			parsed_interaction_history.outputs.push(sanitize_model_response);
			parsed_interaction_history.model_version = model_version;

			fs.writeFileSync(
				`${process.env.INTERACTION_CONV_STORAGE_DIR}/${fileName}`,
				JSON.stringify(parsed_interaction_history)
			);
		};
	}
}
