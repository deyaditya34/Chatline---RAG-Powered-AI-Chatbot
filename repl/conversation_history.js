import { sanitize_and_print_conversation } from "../utils.js";
import { load_conversation_user } from "../conversation/load_conversation_user.js";

export async function conversation_history(conv_name) {

	const parsed_conversation_history_user = await load_conversation_user(conv_name);
	sanitize_and_print_conversation(parsed_conversation_history_user);
}

