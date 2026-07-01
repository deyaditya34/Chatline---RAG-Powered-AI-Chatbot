import fs from "fs";
import { read_user_input } from "../readline.js";
import { print_list, print_message } from "../cli/output.js";
import { USER_CONVERSATIONS_DIR } from "../config/path.js";

export async function list_conversation() {

	const conversation_list = await fs.readdirSync(USER_CONVERSATIONS_DIR);

	if (!conversation_list.length) {
		print_message("no existing conversation found");
		return;
	}

	print_list(conversation_list);
}

