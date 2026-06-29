import dotenv from "dotenv";

dotenv.config();

export let ai_model = process.env.DEFAULT_MODEL;
export let embedding_model = process.env.DEFAULT_EMBEDDING_MODEL;
export let system_instruction_message = process.env.DEFAULT_SYSTEM_INSTRUCTION;
export let conversation_token_limit = Number(process.env.CONVERSATION_TOKEN_LIMIT);

export function set_ai_model(model_name) {
	ai_model = model_name;
}

export function set_system_instruction_message(message) {
	system_instruction_message = message;
}

export function set_conversation_token_limit(token_limit) {
	if (!Number.isNaN(Number(token_limit))) {
		conversation_token_limit = Number(token_limit);
		return `${token_limit} is set as the conversation token limit`
	}
}
