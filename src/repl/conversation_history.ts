import { sanitizeAndPrintConversation } from "../conversation/utils.js";
import { loadConversationUser } from "../conversation/load_conversation_user.js";

export function conversationHistory(convName: string): void {

	const parsedConversationHistoryUser = loadConversationUser(convName);
	sanitizeAndPrintConversation(parsedConversationHistoryUser);
}

