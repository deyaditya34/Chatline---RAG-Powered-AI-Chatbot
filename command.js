import { print_help_command } from "./repl/help.js";
import { change_ai_model } from "./repl/model_set.js";
import { get_model_info } from "./repl/model_info.js";
import { one_time_chat } from "./repl/one_time_chat.js";
import { new_conversation } from "./repl/new_conversation.js";
import { switch_conversation } from "./repl/switch_conversation.js";
import { conversation_history } from "./repl/conversation_history.js";
import { list_conversation } from "./repl/list_conversations.js";
import { delete_conversation } from "./repl/delete_conversation.js";
import { new_interaction } from "./repl/new_interaction.js";
import { interaction_history } from "./repl/interaction_history.js";
import { switch_interaction } from "./repl/switch_interaction.js";
import { list_interaction } from "./repl/list_interactions.js";
import { delete_interaction } from "./repl/delete_interaction.js";
import { print_output } from "./utils.js";
import { print_current_status } from "./repl/current_status.js";
import { new_sliding_window_conversation } from "./repl/new_conversation_fixed_sliding_window.js";
import { switch_sliding_window_conversation } from "./repl/switch_conversation_fixed_sliding_window.js";
import { new_sliding_window_token_based_conversation } from "./repl/new_conversation_token_based_sliding_window.js";
import { switch_sliding_window_token_based_conversation } from "./repl/switch_conversation_token_based_sliding_window.js";
import {
	mode, set_conversation_mode, current_conversation_id,
	set_current_conversation_id_for_new_conv,
	set_current_conversation_id_for_switch_conv
}
	from "./session.js";

import { ai, ai_model_list } from "./ai_model.js";

export async function handle_command(command, args) {
	let conv_name;
	let message;
	let conv_id;

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

		case "chat":
			message = args.join(" ");
			const response = await one_time_chat(message);
			print_output(response, process.env.MODEL_DISPLAY_NAME, "conversations");
			break;

		case "stream":
			message = args.join(" ");
			break;

		case "new":
			conv_name = args.join(" ");
			if (mode === "rest") {
				set_current_conversation_id_for_new_conv(conv_name);
				await new_sliding_window_token_based_conversation(current_conversation_id);
			} else {
				await new_interaction(conv_name);
			}
			break;

		case "switch":
			conv_id = args[0];
			if (mode === "rest") {
				await set_current_conversation_id_for_switch_conv(conv_id);
				await switch_sliding_window_token_based_conversation(current_conversation_id);
			} else {
				await switch_interaction(conv_id);
			}
			break;

		case "history":
			conv_id = args[0]
			if (mode === "rest") {
				await conversation_history(conv_id);
			} else {
				await interaction_history(conv_id);
			}
			break;

		case "conversation_mode":
			const user_input = args[0];
			if (args[0] === "sdk" || args[0] === "rest" || args[0] === "interactions") {
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
				await delete_conversation(conv_id);
			} else {
				await delete_interaction(conv_id);
			}
			break;

		case "exit":
			process.exit(0);
			break;

		default:
			console.log(`invalid command: /${command} ${args.join(" ")}`);
			console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`)
	}
}

