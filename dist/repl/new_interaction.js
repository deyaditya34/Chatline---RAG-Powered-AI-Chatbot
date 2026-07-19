import { handleCommand } from "../command.js";
import { parseCommand } from "./utils.js";
import { readUserInput } from "../readline.js";
import { sanitizeInteraction } from "../interaction/utils.js";
import { printConversation, printMessage } from "../cli/output.js";
import { createNewInteraction } from "../ai_models/gemini_model.js";
import userPrompts from "../prompts/default_user_prompts.json" with { type: "json" };
import { initializeInteraction } from "../interaction/initialize_interaction.js";
import { loadInteraction } from "../interaction/load_interaction.js";
import { storeInteraction } from "../interaction/store_interaction.js";
import { USER_CONV_DISPLAY_NAME } from "../config/env.js";
export async function newInteraction(convName) {
    let userResponse;
    let prevModelResponseId = "";
    await initializeInteraction(convName);
    printMessage(userPrompts.chatUserPrompt);
    while (true) {
        userResponse = await readUserInput(USER_CONV_DISPLAY_NAME);
        if (userResponse.startsWith("/")) {
            const [command, args] = parseCommand(userResponse);
            await handleCommand(command, args);
            break;
        }
        const sanitizedUserResponse = sanitizeInteraction(userResponse, "user");
        let parsedInteractionHistory = await loadInteraction(convName);
        parsedInteractionHistory.outputs.push(sanitizedUserResponse);
        let [modelResponse, modelResponseId, modelVersion] = await createNewInteraction(userResponse, prevModelResponseId);
        prevModelResponseId = modelResponseId;
        printConversation(modelResponse, "model", "interaction");
        const sanitizeModelResponse = sanitizeInteraction(modelResponse, "model");
        sanitizeModelResponse.responseId = modelResponseId;
        parsedInteractionHistory.outputs.push(sanitizeModelResponse);
        parsedInteractionHistory.modelVersion = modelVersion;
        await storeInteraction(convName, parsedInteractionHistory);
    }
}
//# sourceMappingURL=new_interaction.js.map