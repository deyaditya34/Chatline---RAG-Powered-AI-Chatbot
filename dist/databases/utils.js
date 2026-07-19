export function isPayload(payload) {
    return (isConversationPayload(payload) || isUploadDocumentPayload(payload));
}
export function isConversationPayload(payload) {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }
    const data = payload;
    return (typeof data["text"] === "string" &&
        typeof data["conversationId"] === "string" &&
        data["sourceType"] === "conversation" &&
        typeof data["uploadedAt"] === "number" &&
        (data["role"] === "user" || data["role"] === "model"));
}
export function isUploadDocumentPayload(payload) {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }
    const data = payload;
    return (typeof data["text"] === "string" &&
        typeof data["conversationId"] === "string" &&
        data["sourceType"] === "document" &&
        typeof data["uploadedAt"] === "number" &&
        typeof data["documentId"] === "string");
}
//# sourceMappingURL=utils.js.map