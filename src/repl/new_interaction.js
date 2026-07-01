import fs from "fs";
import { handle_command } from "../command.js";
import { parse_command } from "./utils.js";
import { read_user_input } from "../readline.js";
import { create_interaction_record, sanitize_interaction } from "../interaction/utils.js";
import { print_output, print_message } from "../cli/output.js";
import { create_new_interaction } from "../ai_models/gemini_model.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { initialize_interaction } from "../interaction/initialize_interaction.js";
import { load_interaction } from "../interaction/load_interaction.js";
import { store_interaction } from "../interaction/store_interaction.js";

export async function new_interaction(conv_name) {
	let user_response;
	let prev_model_response_id;

	await initialize_interaction(conv_name);

	print_message(user_prompts.chat_user_prompt);
	while (true) {
		user_response = await read_user_input(
			process.env.USER_CONV_DISPLAY_NAME
		);

		if (user_response.startsWith("/")) {
			const [command, args] = parse_command(user_response);

			await handle_command(command, args);
			break;
		}

		const sanitized_user_response = sanitize_interaction(user_response, "user");
		let parsed_interaction_history = await load_interaction(conv_name);

		parsed_interaction_history.outputs.push(sanitized_user_response);

		let [model_response, model_version, model_response_id] =
			await create_new_interaction(user_response, prev_model_response_id);

		prev_model_response_id = model_response_id;
		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "interaction");

		const sanitize_model_response = sanitize_interaction(model_response, "model");
		sanitize_model_response.response_id = model_response_id;
		parsed_interaction_history.outputs.push(sanitize_model_response);
		parsed_interaction_history.model_version = model_version;

		await store_interaction(conv_name, parsed_interaction_history);
	}
}
