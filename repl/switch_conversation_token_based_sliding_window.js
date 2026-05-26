import fs from "fs";
import { parse_command, tail_conversation } from "../utils.js";
import { handle_command } from "../command.js";
import { embed_content } from "../ai_model.js";
import { search_documents } from "../database.js";
import { read_user_input } from "../readline.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import ai_prompts from "../prompts/default_ai_prompts.json" with {type: "json"};
import { sanitize_conversation, sanitize_and_print_conversation, print_output } from "../utils.js";
import { generate_content_using_http, sliding_window_size, conversation_token_limit, count_tokens } from "../ai_model.js";

export async function switch_sliding_window_token_based_conversation(conv_name) {
	let user_response;
	let model_response;
	let sanitize_model_response;

	const chat_save_dir_for_user =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const chat_save_dir_for_model =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_TOKEN_BASED_SLIDING_DIR}`;

	const fileName = conv_name;
	let conversation_history_user = fs.readFileSync(
		`${chat_save_dir_for_user}/${fileName}`
	);
	let parsed_conversation_history_user = JSON.parse(conversation_history_user.toString());
	sanitize_and_print_conversation(parsed_conversation_history_user);

	while (true) {
		user_response = await read_user_input(
			process.env.USER_CONV_DISPLAY_NAME
		);

		if (user_response.startsWith("/")) {
			let sanitize_model_response;
			const [command, args] = parse_command(user_response);

			await handle_command(command, args);
			break;
		}

		const sanitize_user_response = sanitize_conversation(user_response, "user");

		conversation_history_user = fs.readFileSync(`${chat_save_dir_for_user}/${fileName}`);
		parsed_conversation_history_user = JSON.parse(conversation_history_user.toString());
		const conversation_history_model = fs.readFileSync(`${chat_save_dir_for_model}/${fileName}`);
		let parsed_conversation_history_model = JSON.parse(conversation_history_model.toString());

		if (parsed_conversation_history_user.uploadedDocuments.length > 0) {
			const embedding_result = await embed_content(
				sanitize_conversation(user_response, "user")
			);

			const embedding = embedding_result.embedding.values;

			const semantic_result = await search_documents(embedding, fileName, "document");

			if (semantic_result.length > 0) {
				let semantic_context = "You may use the following retrieved context: \n\n";

				for (const point of semantic_result) {
					semantic_context += point.payload.text + "\n\n";
				}

				const sanitize_semantic_context = sanitize_conversation(semantic_context, "user");
				parsed_conversation_history_model.contents.push(sanitize_semantic_context);
			}
		}

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

		let prev_model_version = parsed_conversation_history_user.model_version;
		let [model_response, model_version] = await generate_content_using_http(
			parsed_conversation_history_model.contents,
			prev_model_version
		);

		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversations");
		sanitize_model_response = sanitize_conversation(model_response, "model");

		parsed_conversation_history_user.contents.push(sanitize_model_response);
		parsed_conversation_history_user.model_version = model_version;

		parsed_conversation_history_model.contents.push(sanitize_model_response);

		fs.writeFileSync(
			`${chat_save_dir_for_user}/${fileName}`,
			JSON.stringify(parsed_conversation_history_user)
		);

		fs.writeFileSync(`${chat_save_dir_for_model}/${fileName}`,
			JSON.stringify(parsed_conversation_history_model)
		);
	}
}
