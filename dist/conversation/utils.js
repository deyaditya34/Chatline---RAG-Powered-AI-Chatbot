import { printConversation } from "../cli/output.js";
import {} from "../types/output.js";
import {} from "../types/conversations.js";
import {} from "@google/genai";
export function sanitizeConversation(data, entity) {
    return {
        parts: [{ text: data }],
        role: entity,
    };
}
export function createConversationRecord() {
    return {
        contents: [],
        modelVersion: "",
        tokenLimitExceededOnce: false,
        uploadDocuments: []
    };
}
export function sanitizeAndPrintConversation(conversation) {
    for (const entry of conversation.contents) {
        const firstPart = entry.parts?.[0]?.text;
        if (!firstPart) {
            continue;
        }
        if (entry.role === "user") {
            printConversation(firstPart, "user", "conversation");
        }
        else if (entry.role === "model") {
            printConversation(firstPart, "model", "conversation");
        }
    }
}
//# sourceMappingURL=utils.js.map