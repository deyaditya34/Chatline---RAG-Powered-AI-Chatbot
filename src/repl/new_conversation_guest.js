import fs from "fs";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import { create_conversation_record, sanitize_conversation } from "../conversation/utils.js";
import { print_output, print_message } from "../cli/output.js";
import { parse_command } from "./utils.js";
import { generate_content } from "../ai_models/gemini_model.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function new_conversation_guest() {
	let user_response;

	const initital_conversation_boilerplate = create_conversation_record();

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

		const sanitized_user_response = sanitize_conversation(user_response, "user");

		initital_conversation_boilerplate.contents.push(sanitized_user_response);

		let [model_response, model_version] = await generate_content(
			parsed_conversation_history.contents,
		);

		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversation");

		const sanitized_model_response = sanitize_conversation(model_response, "model");
		initital_conversation_boilerplate.contents.push(sanitized_model_response);
	}
}
