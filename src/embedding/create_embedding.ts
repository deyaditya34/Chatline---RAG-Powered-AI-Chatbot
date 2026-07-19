import { type Content } from "@google/genai";
import { embedContent } from "../ai_models/gemini_model.js";

export async function createEmbedding(content: Content): Promise<number[]> {
	const result = await embedContent(content);

	return result.embedding.values;
}
