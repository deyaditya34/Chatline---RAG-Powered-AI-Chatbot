import { sanitizeAndPrintInteraction } from "../interaction/utils.js";
import { loadInteraction } from "../interaction/load_interaction.js";

export function interactionHistory(convName: string): void {

	const parsedInteractionHistory = loadInteraction(convName);
	sanitizeAndPrintInteraction(parsedInteractionHistory);
}
