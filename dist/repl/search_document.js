import { embedContent } from "../ai_models/gemini_model.js";
import { sanitizeConversation } from "../conversation/utils.js";
import { searchCollection } from "../databases/qdrant.js";
export async function searchDocument(semanticSearch) {
    const embeddingResult = await embedContent(sanitizeConversation(semanticSearch, "user"));
    const embedding = embeddingResult.embedding.values;
    try {
        const searchResult = await searchCollection(embedding);
        console.log("search result -", searchResult);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
        else {
            console.log(err);
        }
    }
}
//# sourceMappingURL=search_document.js.map