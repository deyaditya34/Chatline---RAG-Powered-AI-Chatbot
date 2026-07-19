import { deleteInteractionFile } from "../interaction/delete_interaction_file.js";
import { printMessage } from "../cli/output.js";
export async function deleteInteraction(convName) {
    await deleteInteractionFile(convName);
    printMessage(`interaction - '${convName}' deleted`);
}
//# sourceMappingURL=delete_interaction.js.map