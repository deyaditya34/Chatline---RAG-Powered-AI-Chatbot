import fs from "fs";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import { parse_command, create_conversation_record, print_output, sanitize_conversation } from "../utils.js";
import { generate_content_using_http } from "../ai_model.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function new_conversation_guest() {
	let user_response;

	const initital_conversation_boilerplate = create_conversation_record();

	console.log(user_prompts.chat_user_prompt);
	while (true) {
		user_response = await read_user_input(
			process.env.USER_CONV_DISPLAY_NAME
		);

		if (user_response.startsWith("/")) {
			const [command, args] = parse_command(user_response);

			await handle_command(command, args);
			break;
		}

		const sanitize_user_response = sanitize_conversation(user_response, "user");

		initital_conversation_boilerplate.contents.push(sanitize_user_response);

		let [model_response, model_version] = await generate_content_using_http(
			parsed_conversation_history.contents,
		);

		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversations");

		const sanitize_model_response = sanitize_conversation(model_response, "model");
		initital_conversation_boilerplate.contents.push(sanitize_model_response);
	}
}
