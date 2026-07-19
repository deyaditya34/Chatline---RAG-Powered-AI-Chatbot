import { handleCommand } from "../command.js";
import { readUserInput } from "../readline.js";
import { createInteractionRecord, sanitizeInteraction } from "../interaction/utils.js";
import { parseCommand } from "./utils.js";
import { printConversation, printMessage } from "../cli/output.js";
import { createNewInteraction } from "../ai_models/gemini_model.js";
import userPrompts from "../prompts/default_user_prompts.json" with { type: "json" };
import { USER_CONV_DISPLAY_NAME } from "../config/env.js";
export async function newInteractionGuest() {
    let userResponse;
    let prevModelResponseId;
    const initialInteractionBoilerplate = createInteractionRecord();
    printMessage(userPrompts.chatUserPrompt);
    while (true) {
        userResponse = await readUserInput(USER_CONV_DISPLAY_NAME);
        if (userResponse.startsWith("/")) {
            const [command, args] = parseCommand(userResponse);
            await handleCommand(command, args);
            break;
        }
        const sanitizeUserResponse = sanitizeInteraction(userResponse, "user");
        initialInteractionBoilerplate.outputs.push(sanitizeUserResponse);
        let [modelResponse, modelResponseId] = await createNewInteraction(userResponse, prevModelResponseId);
        prevModelResponseId = modelResponseId;
        printConversation(modelResponse, "model", "interaction");
        const sanitizeModelResponse = sanitizeInteraction(modelResponse, "model");
        initialInteractionBoilerplate.outputs.push(sanitizeModelResponse);
    }
}
//# sourceMappingURL=new_interaction_guest.js.map