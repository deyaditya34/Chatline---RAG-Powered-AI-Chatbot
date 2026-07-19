import type { Payload, ConversationPayload, UploadDocumentPayload } from "../types/vectorDb.js";

export function isPayload(payload: unknown): payload is Payload {
	return (isConversationPayload(payload) || isUploadDocumentPayload(payload))
}

export function isConversationPayload(
	payload: unknown
): payload is ConversationPayload {
	if (typeof payload !== "object" || payload === null) {
		return false;
	}

	const data = payload as Record<string, unknown>;

	return (
		typeof data["text"] === "string" &&
		typeof data["conversationId"] === "string" &&
		data["sourceType"] === "conversation" &&
		typeof data["uploadedAt"] === "number" &&
		(data["role"] === "user" || data["role"] === "model")
	);
}

export function isUploadDocumentPayload(
	payload: unknown
): payload is UploadDocumentPayload {
	if (typeof payload !== "object" || payload === null) {
		return false;
	}

	const data = payload as Record<string, unknown>;

	return (
		typeof data["text"] === "string" &&
		typeof data["conversationId"] === "string" &&
		data["sourceType"] === "document" &&
		typeof data["uploadedAt"] === "number" &&
		typeof data["documentId"] === "string"
	);
}
