import { sanitizeConversation } from "./utils.js";
import { retrieveConversationContext } from "../retrieval/retrieve_conversation_context.js"
import { conversationTokenLimit } from "../config/ai.js";
import * as aiPrompts from "../prompts/default_ai_prompts.json" with {type: "json"};
import { countTokens, generateContent } from "../ai_models/gemini_model.js";
import { type ConversationRecord, type ConversationHistory } from "../types/conversations.js";

export async function enforceTokenLimit(
	parsedConversationHistoryUser: ConversationRecord,
	parsedConversationHistoryModel: ConversationRecord,
	userPromptEmbedding: number[],
	userResponse: string,
	convName: string
): Promise<ConversationHistory> {
	let tokenConsumed = await countTokens(parsedConversationHistoryModel.contents);

	if (tokenConsumed.totalTokens >= conversationTokenLimit) {
		parsedConversationHistoryUser.tokenLimitExceededOnce = true;

		parsedConversationHistoryModel.contents.pop();
		const sanitizedAiSummarizePrompt = sanitizeConversation(
			aiPrompts.default.summarizeUserConvPrompt,
			"user"
		);
		parsedConversationHistoryModel.contents.push(sanitizedAiSummarizePrompt);

		while (true) {
			let [modelResponse] = await generateContent
				(
					parsedConversationHistoryModel.contents
				);

			const sanitizedModelResponse = sanitizeConversation(modelResponse, "user");
			parsedConversationHistoryModel.contents = [];
			parsedConversationHistoryModel.contents.push(sanitizedModelResponse);

			const pastConversationContext = await retrieveConversationContext(
				userPromptEmbedding,
				userResponse,
				convName,
				"conversation"
			);

			if (pastConversationContext) {
				parsedConversationHistoryUser.contents.push(...pastConversationContext);
			}

			parsedConversationHistoryModel.contents.push(sanitizedAiSummarizePrompt);

			tokenConsumed = await countTokens(parsedConversationHistoryModel.contents);

			if (tokenConsumed.totalTokens <= conversationTokenLimit) {
				parsedConversationHistoryModel.contents.pop();
				parsedConversationHistoryModel.contents.push(sanitizedModelResponse);
				break;
			}
		}
	}

	return {
		parsedConversationHistoryUser,
		parsedConversationHistoryModel
	}
}
