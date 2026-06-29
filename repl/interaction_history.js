import { sanitize_and_print_interaction } from "../utils.js";
import { load_interaction } from "../interaction/load_interaction.js";

export async function interaction_history(conv_name) {

	const parsed_interaction_history = await load_interaction(conv_name);
	sanitize_and_print_interaction(parsed_interaction_history);
}
