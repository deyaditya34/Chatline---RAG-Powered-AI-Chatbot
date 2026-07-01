import { delete_interaction_file } from "../interaction/delete_interaction_file.js";
import { print_message } from "../utils.js";

export async function delete_interaction(conv_name) {
	await delete_interaction_file(conv_name);

	print_message(`interaction - '${conv_name}' deleted`);
}
