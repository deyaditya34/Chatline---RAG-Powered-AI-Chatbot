import { sanitizeAndPrintInteraction } from "../interaction/utils.js";
import { loadInteraction } from "../interaction/load_interaction.js";
export function interactionHistory(convName) {
    const parsedInteractionHistory = loadInteraction(convName);
    sanitizeAndPrintInteraction(parsedInteractionHistory);
}
//# sourceMappingURL=interaction_history.js.map