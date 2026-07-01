import { print_output } from "../cli/output.js";

export function sanitize_interaction(data, entity) {
	let result = {};

	result.text = data;
	result.role = entity;

	return result;
}


export function create_interaction_record() {
	const result = {};
	result.outputs = [];
	result.model_version = "";
	return result;
}

export function sanitize_and_print_interaction(interaction) {
	let result = [];

	interaction.outputs.forEach((el) => result.push({ [el.role]: el.text }));

	for (const el of result) {
		if (el.user) {
			print_output(el.user, process.env.USER_DISPLAY_NAME, "interaction");
		}
		else if (el.model) {
			print_output(el.model, process.env.MODEL_DISPLAY_NAME, "interaction");
		}
	}
}

export function parse_prev_model_response_id(interaction_history) {
	let result;
	const int_history_output_len = interaction_history.outputs.length;
	result = interaction_history.outputs[int_history_output_len - 1].response_id;

	return result;
}

