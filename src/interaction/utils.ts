import { printConversation } from "../cli/output.js";
import { type Entity } from "../types/output.js";
import { type InteractionContent, type InteractionRecord } from "../types/interactions.js";

export function sanitizeInteraction(data: string, entity: Entity): InteractionContent {

	return {
		text: data,
		role: entity,
	}
}


export function createInteractionRecord(): InteractionRecord {

	return {
		outputs: [],
		modelVersion: "",
	}
}

export function sanitizeAndPrintInteraction(interaction: InteractionRecord): void {

	for (const entry of interaction.outputs) {
		if (entry.role === "user") {
			printConversation(entry.text, "user", "interaction");
		}
		else if (entry.role === "model") {
			printConversation(entry.text, "model", "interaction");
		}
	}
}

export function parsePrevModelResponseId(interactionHistory: InteractionRecord): string | undefined {
	let result;
	const intHistoryOutputLen = interactionHistory.outputs.length;
	result = interactionHistory.outputs[intHistoryOutputLen - 1]?.responseId;

	return result;
}

