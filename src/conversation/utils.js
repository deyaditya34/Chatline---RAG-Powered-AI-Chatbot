import { print_output } from "../cli/output.js"

export function sanitize_conversation(data, entity) {
	let result = {};

	result.parts = [];
	result.parts.push({ text: data });
	result.role = entity;

	return result;
}

export function create_conversation_record() {
	const result = {};
	result.contents = [];
	result.model_version = "";
	result.token_limit_exceeded_once = false;
	result.uploadedDocuments = [];

	return result;
}

export function sanitize_and_print_conversation(conversation) {
	let result = [];

	conversation.contents.forEach((el) => result.push({ [el.role]: el.parts[0].text }));

	for (const el of result) {
		if (el.user) {
			print_output(el.user, process.env.USER_DISPLAY_NAME, "conversation");
		}
		else if (el.model) {
			print_output(el.model, process.env.MODEL_DISPLAY_NAME, "conversation");
		}
	}
}
