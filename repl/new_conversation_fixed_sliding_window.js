import fs from "fs";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import { parse_command, create_conversation_record, tail_conversation, print_output, sanitize_conversation } from "../utils.js";
import { generate_content_using_http, sliding_window_size } from "../ai_model.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function new_sliding_window_conversation(conv_name) {
	let user_response;
	let chat_topic;

	if (!conv_name) {
		chat_topic = `chat ${new Date().getTime()}`;
	} else {
		chat_topic = `${conv_name}`;
	}

	const chat_save_dir =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const initital_conversation_boilerplate = create_conversation_record();
	fs.writeFileSync(
		`${chat_save_dir}/${chat_topic}`,
		JSON.stringify(initital_conversation_boilerplate)
	);	// creating a file in that dir by the chat topic name

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
		const conversation_history = fs.readFileSync(`${chat_save_dir}/${chat_topic}`);
		let parsed_conversation_history = JSON.parse(conversation_history.toString());
		let chat_contents = parsed_conversation_history.contents;
		let chat_turns = parsed_conversation_history.chat_turns;
		let chat_starting_index = parsed_conversation_history.chat_starting_index;

		if (chat_turns >= sliding_window_size) {
			chat_starting_index += 2;
			chat_contents = tail_conversation(chat_contents, chat_starting_index);
			chat_contents.push(sanitize_user_response);
		}

		parsed_conversation_history.contents.push(sanitize_user_response);

		let [model_response, model_version] = await generate_content_using_http(
			chat_contents,
		);

		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversations");

		const sanitize_model_response = sanitize_conversation(model_response, "model");
		parsed_conversation_history.contents.push(sanitize_model_response);
		parsed_conversation_history.model_version = model_version;
		parsed_conversation_history.chat_starting_index = chat_starting_index;

		chat_turns++;
		parsed_conversation_history.chat_turns = chat_turns;

		fs.writeFileSync(`${chat_save_dir}/${chat_topic}`,
			JSON.stringify(parsed_conversation_history)
		);
	}
}
