import fs from "fs";
import {handle_command} from "../command.js";
import {read_user_input} from "../readline.js";
import {parse_command, create_conversation_record, print_output, sanitize_conversation} from "../utils.js";
import { generate_content_using_http } from "../ai_model";
import {generate_content_using_http} from "../ai_model.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};

export async function new_conversation(conv_name) {
	let user_response;
	let chat_topic;

	if (!conv_name) {
		chat_topic = `chat ${new Date()}`;
	} else {
		chat_topic = `${conv_name}`;
	}
	
}
