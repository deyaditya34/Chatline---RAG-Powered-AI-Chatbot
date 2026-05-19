import fs from "fs";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import { parse_command, create_conversation_record, tail_conversation, print_output, sanitize_conversation } from "../utils.js";
import { generate_content_using_http, sliding_window_size, conversation_token_limit, count_tokens } from "../ai_model.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import ai_prompts from "../prompts/default_ai_prompts.json" with {type: "json"};
import { embed_content } from "../ai_model.js";
import { insert_document, search_documents } from "../database.js";

export async function new_sliding_window_token_based_conversation(conv_name) {
	let user_response;
	let sanitize_model_response;
	let chat_topic = conv_name;

	const chat_save_dir_for_user =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;
	const chat_save_dir_for_model =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_TOKEN_BASED_SLIDING_DIR}`;

	const initital_conversation_boilerplate = create_conversation_record();
	fs.writeFileSync(
		`${chat_save_dir_for_user}/${chat_topic}`,
		JSON.stringify(initital_conversation_boilerplate)
	);	// creating a file in that dir by the chat topic name
	fs.writeFileSync(
		`${chat_save_dir_for_model}/${chat_topic}`,
		JSON.stringify(initital_conversation_boilerplate)
	); // creating a file in that dir by the chat topic name

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
		const conversation_history_user = fs.readFileSync(`${chat_save_dir_for_user}/${chat_topic}`);
		const conversation_history_model = fs.readFileSync(`${chat_save_dir_for_model}/${chat_topic}`);
		let parsed_conversation_history_user = JSON.parse(conversation_history_user.toString());
		let parsed_conversation_history_model = JSON.parse(conversation_history_model.toString());

		parsed_conversation_history_user.contents.push(sanitize_user_response);
		parsed_conversation_history_model.contents.push(sanitize_user_response);

		let token_consumed = await count_tokens(parsed_conversation_history_model.contents);

		if (token_consumed.totalTokens >= conversation_token_limit) {
			parsed_conversation_history_model.contents.pop();
			const sanitize_ai_summarize_prompt = sanitize_conversation(ai_prompts.summarize_user_conv_prompt, "user");
			parsed_conversation_history_model.contents.push(sanitize_ai_summarize_prompt);

			while (true) {
				let [model_response, model_version] = await generate_content_using_http(
					parsed_conversation_history_model.contents
				);

				sanitize_model_response = sanitize_conversation(model_response, "user");
				parsed_conversation_history_model.contents = [];
				parsed_conversation_history_model.contents.push(sanitize_model_response);
				parsed_conversation_history_model.contents.push(sanitize_ai_summarize_prompt);

				token_consumed = await count_tokens(parsed_conversation_history_model.contents);

				if (token_consumed.totalTokens <= conversation_token_limit) {
					parsed_conversation_history_model.contents.pop();
					parsed_conversation_history_model.contents.push(sanitize_user_response);
					break;
				}
			}
		}

		let [model_response, model_version] = await generate_content_using_http(
			parsed_conversation_history_model.contents
		);
		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversations");
		sanitize_model_response = sanitize_conversation(model_response, "model");

		parsed_conversation_history_user.contents.push(sanitize_model_response);
		parsed_conversation_history_user.model_version = model_version;

		parsed_conversation_history_model.contents.push(sanitize_model_response);

		fs.writeFileSync(`${chat_save_dir_for_user}/${chat_topic}`,
			JSON.stringify(parsed_conversation_history_user)
		);

		fs.writeFileSync(`${chat_save_dir_for_model}/${chat_topic}`,
			JSON.stringify(parsed_conversation_history_model)
		);
	}
}
