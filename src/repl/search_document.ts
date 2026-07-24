import { embedContent } from "../ai_models/gemini_model.js";
import { sanitizeConversation } from "../conversation/utils.js";
import { searchCollection } from "../databases/qdrant.js";

export async function searchDocument(semanticSearch: string): Promise<void> {
	const embeddingResult = await embedContent(sanitizeConversation(semanticSearch, "user"));
	const embedding = embeddingResult.embedding.values;

	const searchResult = await searchCollection(embedding);
	console.log("search result -", searchResult);
}
