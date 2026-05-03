import fs from "fs";
import {system_instruction_message} from "./ai_model.js";

// sanitize the conversation of either entity(user or model) so that the
// conversation can be saved in the json file
export function sanitize_conversation(data, entity) {
	let result = {};

	result.parts = [];
	result.parts.push({ text: data });
	result.role = entity;

	return result;
}

export function sanitize_interaction(data, entity) {
	let result = {};

	result.text = data;
	result.role = entity;

	return result;
}

export function print_list(list) {
	process.stdout.write(`\x1B[38;2;255;180;180m`);
	for (let i = 0; i < list.length; i++) {
		console.log(`${i + 1} ${list[i]}`);
	}
	process.stdout.write(`\x1B[0m`);
}

export function create_conversation_record() {
	const result = {};
	result.contents = [];
	result.chat_turns = 0;
	result.chat_starting_index = 0;

	return result;
}

export function create_interaction_record() {
	const result = {};
	result.outputs = [];
	return result;
}

export function print_output(message, entity, job) {
	if (job === "conversations" || job === "interactions") {
		const [first_line, ...rest] = message.split("\n");

		if (entity === process.env.MODEL_DISPLAY_NAME) {
			console.log(`\x1B[38;2;255;180;180m[${entity}]: ${first_line}`);
		} else {
			console.log(`\x1B[38;2;160;160;220m${entity} ${first_line}`);
		}
		for (const line of rest) {
			if (entity === process.env.MODEL_DISPLAY_NAME) {
				console.log(" ".repeat(`[${entity}]: `.length) + line);
			} else {
				console.log(" ".repeat(entity.length) + line);
			}
		}
		process.stdout.write("\x1B[0m");
	}
	else if (job === "model_info") {
		let result = {};
		for (const [key, value] of Object.entries(message)) {
			switch (typeof (value)) {
				case "object":
					if (Array.isArray(value)) {
						result[key] = value.join(", ");
					} else {
						result[key] = "";
					}
					break;
				default:
					result[key] = value;
			}
		}
		console.log(`\x1B[38;2;255;180;180m[${entity}]: \x1B[0m`);
		console.table(result);
	}
	else if (job === "model_list") {
		let result = {};
		for (let i = 0; i < message.length; i++) {
			let key = message[i].name;
			let value = message[i].description;

			result[key] = value;
		}

		console.log(`\x1B[38;2;255;180;180m[${entity}]: \x1B[0m`);
		console.table(result);
	}
}

export function sanitize_and_print_conversation(conversation) {
	let result = [];

	conversation.contents.forEach((el) => result.push({ [el.role]: el.parts[0].text }));

	for (const el of result) {
		if (el.user) {
			print_output(el.user, process.env.USER_DISPLAY_NAME, "conversations");
		}
		else if (el.model) {
			print_output(el.model, process.env.MODEL_DISPLAY_NAME, "conversations");
		}
	}
}

export function sanitize_and_print_interaction(interaction) {
	let result = [];

	interaction.outputs.forEach((el) => result.push({ [el.role]: el.text }));

	for (const el of result) {
		if (el.user) {
			print_output(el.user, process.env.USER_DISPLAY_NAME, "interactions");
		}
		else if (el.model) {
			print_output(el.model, process.env.MODEL_DISPLAY_NAME, "interactions");
		}
	}
}

export function parse_prev_model_response_id(interaction_history) {
	let result;
	const int_history_output_len = interaction_history.outputs.length;
	result = interaction_history.outputs[int_history_output_len - 1].response_id;

	return result;
}

export function parse_command(input) {
	let [command, ...args] = input.split(" ");

	command = command.slice(1, command.length);
	return [command, args];
}

export function tail_conversation(contents, content_starting_index) {
	const result = [];

	for (let i = content_starting_index; i < contents.length; i++) {
		result.push(contents[i]);
	}

	return result;
}
