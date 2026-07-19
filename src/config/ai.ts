import { DEFAULT_MODEL, DEFAULT_EMBEDDING_MODEL, DEFAULT_SYSTEM_INSTRUCTION, CONVERSATION_TOKEN_LIMIT } from "./env.js";

export let aiModel = DEFAULT_MODEL;
export let embeddingModel = DEFAULT_EMBEDDING_MODEL;
export let systemInstructionMessage = DEFAULT_SYSTEM_INSTRUCTION;
export let conversationTokenLimit = Number(CONVERSATION_TOKEN_LIMIT);

export function setAiModel(modelName: string): void {
	aiModel = modelName;
}

export function setSystemInstructionMessage(message: string): string{
	systemInstructionMessage = message;

	return `system instruction message saved - '${message}'`;
}

export function setConversationTokenLimit(tokenLimit: string): string {
	if (!Number.isNaN(Number(tokenLimit))) {
		conversationTokenLimit = Number(tokenLimit);
		return `${tokenLimit} is set as the conversation token limit`
	}

	return `${tokenLimit} must be a valid number`;
}
