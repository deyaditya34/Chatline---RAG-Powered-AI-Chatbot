import { printConversation } from "../cli/output.js";
import {} from "../types/output.js";
import {} from "../types/interactions.js";
export function sanitizeInteraction(data, entity) {
    return {
        text: data,
        role: entity,
    };
}
export function createInteractionRecord() {
    return {
        outputs: [],
        modelVersion: "",
    };
}
export function sanitizeAndPrintInteraction(interaction) {
    for (const entry of interaction.outputs) {
        if (entry.role === "user") {
            printConversation(entry.text, "user", "interaction");
        }
        else if (entry.role === "model") {
            printConversation(entry.text, "model", "interaction");
        }
    }
}
export function parsePrevModelResponseId(interactionHistory) {
    let result;
    const intHistoryOutputLen = interactionHistory.outputs.length;
    result = interactionHistory.outputs[intHistoryOutputLen - 1]?.responseId;
    return result;
}
//# sourceMappingURL=utils.js.map