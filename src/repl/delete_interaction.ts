import { deleteInteractionFile } from "../interaction/delete_interaction_file.js";
import { printMessage } from "../cli/output.js";

export async function deleteInteraction(convName: string): Promise<void> {
	await deleteInteractionFile(convName);

	printMessage(`interaction - '${convName}' deleted`);
}
