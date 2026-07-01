import fs from "fs";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import { create_interaction_record, sanitize_interaction } from "../interaction/utils.js";
import { parse_command } from "./utils.js";
import { print_output, print_message } from "../cli/output.js";
import { create_new_interaction } from "../ai_models/gemini_model.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function new_interaction_guest() {
	let user_response;
	let prev_model_response_id;

	const initial_interaction_boilerplate = create_interaction_record();

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

		const sanitize_user_response = sanitize_interaction(user_response, "user");

		initial_interaction_boilderplate.outputs.push(sanitize_user_response);

		let [model_response, model_version, model_response_id] =
			await create_new_interaction(user_response, prev_model_response_id);

		prev_model_response_id = model_response_id;
		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "interaction");

		const sanitize_model_response = sanitize_interaction(model_response, "model");
		initial_interaction_boilderplate.outputs.push(sanitize_model_response);
	}
}
