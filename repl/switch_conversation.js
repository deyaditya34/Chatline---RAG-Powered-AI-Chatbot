import fs from "fs";
import { parse_command } from "../utils.js";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { sanitize_conversation, sanitize_and_print_conversation, print_output } from "../utils.js";
import { generate_content_using_http } from "../ai_model.js";

export async function switch_conversation(conv_id) {
	let user_response;
	let model_response;

	if (!conv_id) {
		console.log("usage: /switch <id>");
		return;
	}

	const chat_save_dir =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const conversation_list = await fs.readdirSync(
		`${chat_save_dir}`
	);

	const fileNo = Number(conv_id) - 1;

	if (fileNo > conversation_list.length - 1 || !Number(conv_id)) {
		console.log("invalid input");
		return;
	}

	const fileName = conversation_list[fileNo];
	const conversation_history = fs.readFileSync(
		`${chat_save_dir}/${fileName}`
	);
	const parsed_conversation_history = JSON.parse(conversation_history.toString());
	sanitize_and_print_conversation(parsed_conversation_history);

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
		parsed_conversation_history.contents.push(sanitize_user_response);

		let prev_model_version = parsed_conversation_history.model_version;
		let [model_response, model_version] = await generate_content_using_http(
			parsed_conversation_history.contents,
			prev_model_version
		);
		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversations");

		const sanitize_model_response = sanitize_conversation(model_response, "model");
		parsed_conversation_history.contents.push(sanitize_model_response);
		parsed_conversation_history.model_version = model_version;

		fs.writeFileSync(
			`${chat_save_dir}/${fileName}`,
			JSON.stringify(parsed_conversation_history)
		);
	}
}
