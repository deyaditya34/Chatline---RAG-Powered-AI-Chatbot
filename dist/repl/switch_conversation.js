import { handleCommand } from "../command.js";
import { readUserInput } from "../readline.js";
import { printConversation } from "../cli/output.js";
import { parseCommand } from "./utils.js";
import { sanitizeConversation, sanitizeAndPrintConversation } from "../conversation/utils.js";
import { generateContent } from "../ai_models/gemini_model.js";
import { loadConversation } from "../conversation/load_conversation.js";
import { createEmbedding } from "../embedding/create_embedding.js";
import { enforceTokenLimit } from "../conversation/enforce_token_limit.js";
import { storeConversationDb } from "../conversation/store_conversation_db.js";
import { storeConversationFile } from "../conversation/store_conversation_file.js";
import { retrieveConversationHistory } from "../retrieval/retrieve_conversation_history.js";
import { retrieveUploadedDocuments } from "../retrieval/retrieve_uploaded_documents.js";
import { USER_CONV_DISPLAY_NAME } from "../config/env.js";
export async function switchConversation(convName) {
    let userResponse;
    let { parsedConversationHistoryUser, parsedConversationHistoryModel } = await loadConversation(convName);
    sanitizeAndPrintConversation(parsedConversationHistoryUser);
    while (true) {
        userResponse = await readUserInput(USER_CONV_DISPLAY_NAME);
        if (userResponse.startsWith("/")) {
            const [command, args] = parseCommand(userResponse);
            await handleCommand(command, args);
            break;
        }
        const sanitizedUserResponse = sanitizeConversation(userResponse, "user");
        const userPromptEmbedding = await createEmbedding(sanitizedUserResponse);
        if (parsedConversationHistoryUser.uploadDocuments.length > 0) {
            const pastUploadedDocumentContext = await retrieveUploadedDocuments(userPromptEmbedding, userResponse, convName);
            if (pastUploadedDocumentContext) {
                parsedConversationHistoryModel.contents.push(...pastUploadedDocumentContext);
            }
        }
        if (parsedConversationHistoryUser.tokenLimitExceededOnce) {
            const pastConversationContext = await retrieveConversationHistory(userPromptEmbedding, userResponse, convName);
            if (pastConversationContext) {
                parsedConversationHistoryModel.contents.push(...pastConversationContext);
            }
        }
        parsedConversationHistoryUser.contents.push(sanitizeConversation(userResponse, "user"));
        parsedConversationHistoryModel.contents.push(sanitizeConversation(userResponse, "user"));
        ({ parsedConversationHistoryUser, parsedConversationHistoryModel } =
            await enforceTokenLimit(parsedConversationHistoryUser, parsedConversationHistoryModel, userPromptEmbedding, userResponse, convName));
        let prevModelVersion = parsedConversationHistoryUser.modelVersion;
        let [modelResponse, modelVersion] = await generateContent(parsedConversationHistoryModel.contents, prevModelVersion);
        let sanitizedModelResponse = sanitizeConversation(modelResponse, "model");
        let modelResponseEmbedding = await createEmbedding(sanitizedModelResponse);
        printConversation(modelResponse, "model", "conversation");
        parsedConversationHistoryUser.contents.push(sanitizedModelResponse);
        parsedConversationHistoryUser.modelVersion = modelVersion;
        parsedConversationHistoryModel.contents.push(sanitizedModelResponse);
        await storeConversationFile(convName, parsedConversationHistoryUser, parsedConversationHistoryModel);
        await storeConversationDb(userResponse, modelResponse, userPromptEmbedding, modelResponseEmbedding, convName);
    }
}
//# sourceMappingURL=switch_conversation.js.map