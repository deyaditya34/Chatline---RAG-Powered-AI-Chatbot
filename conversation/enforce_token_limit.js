import { sanitize_conversation } from "../utils.js";
import { retrieve_conversation_context } from "../retrieval/retrieve_conversation_context.js"
import { count_tokens } from "../ai_models/gemini_model.js";

export async function enforce_token_limit(
	parsed_conversation_history_user,
	parsed_conversation_history_model,
	user_prompt_embedding,
	conv_name
) {
	let token_consumed = await count_tokens(parsed_conversation_history_model.contents);

	if (token_consumed.totalTokens >= conversation_token_limit) {
		parsed_conversation_history_user.token_limit_exceeded_once = true;

		parsed_conversation_history_model.contents.pop();
		const sanitized_ai_summarize_prompt = sanitize_conversation(
			ai_prompts.summarize_user_conv_prompt,
			"user"
		);
		parsed_conversation_history_model.contents.push(sanitized_ai_summarize_prompt);

		while (true) {
			let [model_response, model_version] = await generate_content
				(
					parsed_conversation_history_model.contents
				);

			sanitized_model_response = sanitize_conversation(model_response, "user");
			parsed_conversation_history_model.contents = [];
			parsed_conversation_history_model.contents.push(sanitized_model_response);

			past_conversation_context = await retrieve_conversation_context(
				user_prompt_embedding,
				user_response,
				conv_name
			);

			if (past_conversation_context) {
				parsed_conversation_history_user.contents.push(past_conversation_context);
			}

			parsed_conversation_history_model.contents.push(sanitized_ai_summarize_prompt);

			token_consumed = await count_tokens(parsed_conversation_history_model.contents);

			if (token_consumed.totalTokens <= conversation_token_limit) {
				parsed_conversation_history_model.contents.pop();
				parsed_conversation_history_model.contents.push(sanitize_user_response);
				break;
			}
		}
	}

	return {
		parsed_conversation_history_user,
		parsed_conversation_history_model
	}
}
