import { handleCommand } from "../command.js";
import { readUserInput } from "../readline.js";
import { sanitizeConversation } from "../conversation/utils.js";
import { parseCommand } from "./utils.js";
import { printMessage, printConversation } from "../cli/output.js";
import userPrompts from "../prompts/default_user_prompts.json" with { type: "json" };
import { generateContent } from "../ai_models/gemini_model.js";
import { initializeConversation } from "../conversation/initialize_conversation.js";
import { loadConversation } from "../conversation/load_conversation.js";
import { createEmbedding } from "../embedding/create_embedding.js";
import { storeConversationFile } from "../conversation/store_conversation_file.js";
import { retrieveConversationContext } from "../retrieval/retrieve_conversation_context.js";
import { enforceTokenLimit } from "../conversation/enforce_token_limit.js";
import { storeConversationDb } from "../conversation/store_conversation_db.js";
import { USER_DISPLAY_NAME } from "../config/env.js";
export async function newConversation(convName) {
    let userResponse;
    await initializeConversation(convName);
    printMessage(userPrompts.chatUserPrompt);
    while (true) {
        userResponse = await readUserInput(USER_DISPLAY_NAME);
        if (userResponse.startsWith("/")) {
            const [command, args] = parseCommand(userResponse);
            await handleCommand(command, args);
            break;
        }
        const sanitizedUserResponse = sanitizeConversation(userResponse, "user");
        let { parsedConversationHistoryUser, parsedConversationHistoryModel } = await loadConversation(convName);
        const userPromptEmbedding = await createEmbedding(sanitizedUserResponse);
        if (parsedConversationHistoryUser.tokenLimitExceededOnce) {
            const pastConversationContext = await retrieveConversationContext(userPromptEmbedding, userResponse, convName, "conversation");
            if (pastConversationContext) {
                parsedConversationHistoryModel.contents.push(...pastConversationContext);
            }
        }
        parsedConversationHistoryUser.contents.push(sanitizedUserResponse);
        parsedConversationHistoryModel.contents.push(sanitizedUserResponse);
        ({ parsedConversationHistoryUser, parsedConversationHistoryModel } =
            await enforceTokenLimit(parsedConversationHistoryUser, parsedConversationHistoryModel, userPromptEmbedding, userResponse, convName));
        let [modelResponse, modelVersion] = await generateContent(parsedConversationHistoryModel.contents);
        let sanitizedModelResponse = sanitizeConversation(modelResponse, "model");
        let modelResponseEmbedding = await createEmbedding(sanitizedModelResponse);
        await storeConversationDb(userResponse, modelResponse, userPromptEmbedding, modelResponseEmbedding, convName);
        printConversation(modelResponse, "model", "conversation");
        parsedConversationHistoryUser.contents.push(sanitizedModelResponse);
        parsedConversationHistoryUser.modelVersion = modelVersion;
        parsedConversationHistoryModel.contents.push(sanitizedModelResponse);
        await storeConversationFile(convName, parsedConversationHistoryUser, parsedConversationHistoryModel);
    }
}
//# sourceMappingURL=new_conversation.js.map