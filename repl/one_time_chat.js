import { ai, ai_model, generate_content } from "../ai_model.js"
import * as ai_prompts from "../prompts/default_ai_prompts.json" with {type: "json"};

export async function one_time_chat(content = ai_prompts.starting_chat_message) {
	const response = await generate_content(ai, content, ai_model);

	return response;
}
