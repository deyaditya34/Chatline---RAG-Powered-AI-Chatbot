import dotenv from "dotenv";
dotenv.config();

function getEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`${name} is not defined`);
	}

	return value;
}

export const GEMINI_API_KEY = getEnv("GEMINI_API_KEY");
export const DATA_DIR = getEnv("DATA_DIR");
export const CONVERSATIONS_DIR = getEnv("CONVERSATIONS_DIR");
export const USER_CONVERSATIONS_DIR = getEnv("USER_CONVERSATIONS_DIR");
export const MODEL_CONVERSATIONS_DIR = getEnv("MODEL_CONVERSATIONS_DIR");
export const INTERACTIONS_DIR = getEnv("INTERACTIONS_DIR");
export const CONVERSATION_TOKEN_LIMIT = getEnv("CONVERSATION_TOKEN_LIMIT");
export const DEFAULT_MODEL = getEnv("DEFAULT_MODEL");
export const DEFAULT_MODE = getEnv("DEFAULT_MODE");
export const DEFAULT_SYSTEM_INSTRUCTION = getEnv("DEFAULT_SYSTEM_INSTRUCTION");
export const DEFAULT_EMBEDDING_MODEL = getEnv("DEFAULT_EMBEDDING_MODEL");
export const SEMANTIC_DB_COLLECTION_NAME = getEnv("SEMANTIC_DB_COLLECTION_NAME");
export const ELASTIC_DB_COLLECTION_NAME = getEnv("ELASTIC_DB_COLLECTION_NAME");
export const MODEL_DISPLAY_NAME = getEnv("MODEL_DISPLAY_NAME");
export const USER_DISPLAY_NAME = getEnv("USER_DISPLAY_NAME");
export const USER_CONV_DISPLAY_NAME = getEnv("USER_CONV_DISPLAY_NAME");

