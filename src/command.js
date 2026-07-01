import { print_help_command } from "./repl/help.js";
import { change_ai_model } from "./repl/model_set.js";
import { get_model_info } from "./repl/model_info.js";
import { new_conversation_guest } from "./repl/new_conversation_guest.js";
import { conversation_history } from "./repl/conversation_history.js";
import { list_conversation } from "./repl/list_conversations.js";
import { delete_conversation } from "./repl/delete_conversation.js";
import { new_interaction } from "./repl/new_interaction.js";
import { new_interaction_guest } from "./repl/new_interaction_guest.js";
import { interaction_history } from "./repl/interaction_history.js";
import { switch_interaction } from "./repl/switch_interaction.js";
import { list_interaction } from "./repl/list_interactions.js";
import { delete_interaction } from "./repl/delete_interaction.js";
import { print_output, print_message } from "./cli/output.js";
import { print_current_status } from "./repl/current_status.js";
import { new_conversation } from "./repl/new_conversation.js";
import { switch_conversation } from "./repl/switch_conversation.js";
import {
	mode, set_conversation_mode, current_conversation_id,
	set_current_conversation_id_from_conv_name,
	set_current_conversation_id_from_conv_id,
	set_current_convsersation_id_from_interaction_name,
	set_current_conversation_id_from_interaction_id
}
	from "./session.js";
import { embed_document } from "./repl/embed_document.js";
import {
	ai,
	ai_model_list,
} from "./ai_models/gemini_model.js";
import { set_system_instruction_message, set_conversation_token_limit } from "./config/ai.js";
import { delete_coll } from "./repl/delete_collection.js";
import * as elastic_search from "./databases/elastic_search.js";

export async function handle_command(command, args) {
	let conv_name;
	let message;
	let conv_id;
	let result;

	switch (command) {
		case "help":
			print_help_command();
			break;

		case "models":
			const list = await ai_model_list(ai);
			print_output(list, process.env.MODEL_DISPLAY_NAME, "model_list");
			break;

		case "model":
			if (!args.length) {
				console.error("usage: /set_model <name>");
				break;
			}
			const model_set = await change_ai_model(args[0]);
			if (!model_set) {
				console.error("invalid model name");
			} else {
				console.log("current model :", args[0]);
			}
			break;

		case "system_instruction":
			const message = args.join(" ");
			set_system_instruction_message(message);
			break;

		case "token_limit":
			const token_limit = args[0];
			result = set_conversation_token_limit(token_limit);
			print_message(result);
			break;

		case "model_info":
			try {
				const model_info = await get_model_info(args[0]);
				print_output(model_info, process.env.MODEL_DISPLAY_NAME, "model_info");
			} catch (err) {
				console.log(err.message);
			}
			break;

		case "status":
			print_current_status();
			break;

		case "guest_chat":
			if (mode === "rest") {
				await new_conversation_guest();
			} else {
				await new_interaction_guest();
			}
			break;

		case "new":
			conv_name = args.join(" ");
			if (mode === "rest") {
				set_current_conversation_id_from_conv_name(conv_name);
				await new_conversation(current_conversation_id);
			} else {
				set_current_convsersation_id_from_interaction_name(conv_name);
				await new_interaction(conv_name);
			}
			break;

		case "switch":
			conv_id = args[0];
			if (mode === "rest") {
				await set_current_conversation_id_from_conv_id(conv_id);
				await switch_conversation(current_conversation_id);
			} else {
				await set_current_conversation_id_from_interaction_id(conv_id);
				await switch_interaction(current_conversation_id);
			}
			break;

		case "history":
			conv_id = args[0]
			if (mode === "rest") {
				await set_current_conversation_id_from_conv_id(conv_id);
				await conversation_history(current_conversation_id);
			} else {
				await set_current_conversation_id_from_interaction_id(conv_id);
				await interaction_history(current_conversation_id);
			}
			break;

		case "conversation_mode":
			const user_input = args[0];
			if (args[0] === "rest" || args[0] === "interaction") {
				set_conversation_mode(args[0]);
			} else {
				console.log("invalid_user_input");
			}
			break;

		case "list":
			if (mode === "rest") {
				await list_conversation();
			} else {
				await list_interaction();
			}
			break;

		case "delete":
			conv_id = args[0];
			if (mode === "rest") {
				await set_current_conversation_id_from_conv_id(conv_id);
				await delete_conversation(current_conversation_id);
			} else {
				await set_current_conversation_id_from_interaction_id(conv_id);
				await delete_interaction(current_conversation_id);
			}
			break;

		case "embed":
			const doc_path = args[0];
			await embed_document(doc_path, current_conversation_id);
			break;

		case "clear":
			console.clear();
			break;

		case "exit":
			process.exit(0);
			break;

		case "delete_coll":
			await delete_coll();
			await elastic_search.delete_index(process.env.ELASTIC_DB_COLLECTION_NAME);
			break;

		default:
			console.log(`invalid command: /${command} ${args.join(" ")}`);
			console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)
	}
}

