import { printHelpCommand } from "./repl/help.js";
import { changeAiModel } from "./repl/model_set.js";
import { getModelInfo } from "./repl/model_info.js";
import { newConversationGuest } from "./repl/new_conversation_guest.js";
import { conversationHistory } from "./repl/conversation_history.js";
import { listConversation } from "./repl/list_conversations.js";
import { deleteConversation } from "./repl/delete_conversation.js";
import { newInteraction } from "./repl/new_interaction.js";
import { newInteractionGuest } from "./repl/new_interaction_guest.js";
import { interactionHistory } from "./repl/interaction_history.js";
import { switchInteraction } from "./repl/switch_interaction.js";
import { listInteraction } from "./repl/list_interactions.js";
import { deleteInteraction } from "./repl/delete_interaction.js";
import { printMessage, printModelList, printModelInfo } from "./cli/output.js";
import { printCurrentStatus } from "./repl/current_status.js";
import { newConversation } from "./repl/new_conversation.js";
import { switchConversation } from "./repl/switch_conversation.js";
import { mode, setConversationMode, currentConversationId, setCurrentConversationIdFromConvName, setCurrentConversationIdFromConvId, setCurrentConversationIdFromInteractionName, setCurrentConversationIdFromInteractionId } from "./session.js";
import { embedDocument } from "./repl/embed_document.js";
import { ai, aiModelList, } from "./ai_models/gemini_model.js";
import { setSystemInstructionMessage, setConversationTokenLimit } from "./config/ai.js";
import { deleteColl } from "./repl/delete_collection.js";
import * as elasticSearch from "./databases/elastic_search.js";
export async function handleCommand(command, args) {
    let convName;
    let convId;
    let result;
    switch (command) {
        case "help":
            printHelpCommand();
            break;
        case "models":
            const list = await aiModelList(ai);
            printModelList(list);
            break;
        case "model":
            if (!args[0]) {
                console.error("usage: /set_model <name>");
                break;
            }
            const modelSet = await changeAiModel(args[0]);
            if (!modelSet) {
                console.error("invalid model name");
            }
            else {
                console.log("current model :", args[0]);
            }
            break;
        case "system_instruction":
            const message = args.join(" ");
            result = setSystemInstructionMessage(message);
            printMessage(result);
            break;
        case "token_Limit":
            if (!args[0]) {
                console.error("usage: /token_limit <limit>");
                break;
            }
            const tokenLimit = args[0];
            result = setConversationTokenLimit(tokenLimit);
            printMessage(result);
            break;
        case "model_info":
            try {
                const model_info = await getModelInfo(args[0]);
                printModelInfo(model_info);
            }
            catch (err) {
                if (err instanceof Error) {
                    console.log(err.message);
                }
                else {
                    console.log(err);
                }
            }
            break;
        case "status":
            printCurrentStatus();
            break;
        case "guest_chat":
            if (mode === "rest") {
                await newConversationGuest();
            }
            else {
                await newInteractionGuest();
            }
            break;
        case "new":
            convName = args.join(" ");
            if (mode === "rest") {
                setCurrentConversationIdFromConvName(convName);
                await newConversation(currentConversationId);
            }
            else {
                setCurrentConversationIdFromInteractionName(convName);
                await newInteraction(convName);
            }
            break;
        case "switch":
            if (!args[0]) {
                console.log("usage: /switch <conversation_id>");
                break;
            }
            convId = args[0];
            if (mode === "rest") {
                setCurrentConversationIdFromConvId(convId);
                await switchConversation(currentConversationId);
            }
            else {
                setCurrentConversationIdFromInteractionId(convId);
                await switchInteraction(currentConversationId);
            }
            break;
        case "history":
            if (!args[0]) {
                console.log("usage: /history <conversation_id>");
                break;
            }
            convId = args[0];
            if (mode === "rest") {
                setCurrentConversationIdFromConvId(convId);
                await conversationHistory(currentConversationId);
            }
            else {
                setCurrentConversationIdFromInteractionId(convId);
                await interactionHistory(currentConversationId);
            }
            break;
        case "conversation_mode":
            if (!args[0]) {
                console.log("usage: /conversation_mode <rest | interaction>");
                break;
            }
            const userInput = args[0];
            if (args[0] === "rest" || args[0] === "interaction") {
                setConversationMode(userInput);
            }
            else {
                console.log("invalid_user_input");
            }
            break;
        case "list":
            if (mode === "rest") {
                listConversation();
            }
            else {
                listInteraction();
            }
            break;
        case "delete":
            if (!args[0]) {
                console.log("usage: /delete <conversation_id>");
                break;
            }
            convId = args[0];
            if (mode === "rest") {
                setCurrentConversationIdFromConvId(convId);
                await deleteConversation(currentConversationId);
            }
            else {
                setCurrentConversationIdFromInteractionId(convId);
                await deleteInteraction(currentConversationId);
            }
            break;
        case "embed":
            if (!args[0]) {
                console.log("usage: /embed <doc_path>");
                break;
            }
            const docPath = args[0];
            await embedDocument(docPath, currentConversationId);
            break;
        case "clear":
            console.clear();
            break;
        case "exit":
            process.exit(0);
            break;
        case "delete_coll":
            await deleteColl();
            await elasticSearch.deleteIndex();
            break;
        default:
            console.log(`invalid command: /${command} ${args.join(" ")}`);
            console.log(`\x1B[38;2;255;180;180mType /help for commands\n\x1B[0m`);
    }
}
//# sourceMappingURL=command.js.map