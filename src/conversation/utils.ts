import { printConversation } from "../cli/output.js"
import { type Entity } from "../types/output.js";
import { type ConversationRecord } from "../types/conversations.js";
import { type Content } from "@google/genai";

export function sanitizeConversation(data: string, entity: Entity): Content {

	return {
		parts: [{ text: data }],
		role: entity,
	}
}

export function createConversationRecord(): ConversationRecord {

	return {
		contents: [],
		modelVersion: "",
		tokenLimitExceededOnce: false,
		uploadDocuments: []
	}
}

export function sanitizeAndPrintConversation(conversation: ConversationRecord): void {

	for (const entry of conversation.contents) {
		const firstPart = entry.parts?.[0]?.text;

		if (!firstPart) {
			continue;
		}

		if (entry.role === "user") {
			printConversation(firstPart, "user", "conversation");
		} else if (entry.role === "model") {
			printConversation(firstPart, "model", "conversation");
		}
	}
}
