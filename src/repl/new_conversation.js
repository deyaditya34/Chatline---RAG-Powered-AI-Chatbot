import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import { parse_command, print_output, sanitize_conversation, print_message } from "../utils.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import ai_prompts from "../prompts/default_ai_prompts.json" with {type: "json"};
import { generate_content } from "../ai_models/gemini_model.js";
import { initialize_conversation } from "../conversation/initialize_conversation.js";
import { load_conversation } from "../conversation/load_conversation.js";
import { create_embedding } from "../embedding/create_embedding.js";
import { store_conversation_file } from "../conversation/store_conversation_file.js";
import { retrieve_conversation_context } from "../retrieval/retrieve_conversation_context.js";
import { enforce_token_limit } from "../conversation/enforce_token_limit.js";
import { store_conversation_db } from "../conversation/store_conversation_db.js";

export async function new_conversation(conv_name) {
	let user_response;

	await initialize_conversation(conv_name);

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
		let { parsed_conversation_history_user, parsed_conversation_history_model } =
			await load_conversation(conv_name);

		const user_prompt_embedding = await create_embedding(sanitized_user_response);

		if (parsed_conversation_history_user.token_limit_exceeded_once) {
			const past_conversation_context = await retrieve_conversation_context(
				user_prompt_embedding,
				user_response,
				conv_name,
				"conversation"
			);

			if (past_conversation_context) {
				parsed_conversation_history_model.contents.push(...past_conversation_context);
			}
		}

		parsed_conversation_history_user.contents.push(sanitized_user_response);
		parsed_conversation_history_model.contents.push(sanitized_user_response);

		({ parsed_conversation_history_user, parsed_conversation_history_model } =
			await enforce_token_limit(
				parsed_conversation_history_user,
				parsed_conversation_history_model,
				user_prompt_embedding,
				conv_name
			));

		let [model_response, model_version] = await generate_content(
			parsed_conversation_history_model.contents
		);

		let sanitized_model_response = sanitize_conversation(model_response, "model");

		let model_response_embedding = await create_embedding(sanitized_model_response);

		await store_conversation_db(
			user_response,
			model_response,
			user_prompt_embedding,
			model_response_embedding,
			conv_name
		);

		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversation");

		parsed_conversation_history_user.contents.push(sanitized_model_response);
		parsed_conversation_history_user.model_version = model_version;

		parsed_conversation_history_model.contents.push(sanitized_model_response);

		await store_conversation_file(
			conv_name,
			parsed_conversation_history_user,
			parsed_conversation_history_model
		);
	}
}
