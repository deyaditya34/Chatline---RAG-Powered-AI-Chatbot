import { delete_conversation_db } from "../conversation/delete_conversation_db.js";
import { delete_conversation_file } from "../conversation/delete_conversation_file.js";
import { print_message } from "../cli/output.js";

export async function delete_conversation(conv_name) {
	await delete_conversation_db(conv_name);
	await delete_conversation_file(conv_name);

	print_message(`conversation - '${conv_name}' deleted`);

}
