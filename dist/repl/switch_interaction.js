import { parseCommand } from "./utils.js";
import { handleCommand } from "../command.js";
import { readUserInput } from "../readline.js";
import { sanitizeInteraction, sanitizeAndPrintInteraction, parsePrevModelResponseId } from "../interaction/utils.js";
import { printConversation } from "../cli/output.js";
import { createNewInteraction } from "../ai_models/gemini_model.js";
import { loadInteraction } from "../interaction/load_interaction.js";
import { storeInteraction } from "../interaction/store_interaction.js";
import { USER_CONV_DISPLAY_NAME } from "../config/env.js";
export async function switchInteraction(convName) {
    let userResponse;
    let parsedInteractionHistory = await loadInteraction(convName);
    let prevModelResponseId = parsePrevModelResponseId(parsedInteractionHistory);
    sanitizeAndPrintInteraction(parsedInteractionHistory);
    while (true) {
        userResponse = await readUserInput(USER_CONV_DISPLAY_NAME);
        if (userResponse.startsWith("/")) {
            const [command, args] = parseCommand(userResponse);
            await handleCommand(command, args);
            break;
        }
        ;
        const sanitizedUserResponse = sanitizeInteraction(userResponse, "user");
        parsedInteractionHistory.outputs.push(sanitizedUserResponse);
        let prevModelVersion = parsedInteractionHistory.modelVersion;
        let [modelResponse, modelVersion, modelResponseId] = await createNewInteraction(userResponse, prevModelResponseId, prevModelVersion);
        prevModelResponseId = modelResponseId;
        printConversation(modelResponse, "model", "interaction");
        const sanitizedModelResponse = sanitizeInteraction(modelResponse, "model");
        parsedInteractionHistory.outputs.push(sanitizedModelResponse);
        parsedInteractionHistory.modelVersion = modelVersion;
        await storeInteraction(convName, parsedInteractionHistory);
    }
    ;
}
//# sourceMappingURL=switch_interaction.js.map