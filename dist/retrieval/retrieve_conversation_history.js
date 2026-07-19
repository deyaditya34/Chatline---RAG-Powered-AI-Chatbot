import * as vectorStore from "../databases/qdrant.js";
import * as keywordStore from "../databases/elastic_search.js";
import { sanitizeConversation } from "../conversation/utils.js";
import { isConversationPayload } from "../databases/utils.js";
export async function retrieveConversationHistory(userPromptEmbedding, userResponse, convName, source = "conversation") {
    const contexts = [];
    const semanticResult = await vectorStore.searchDocuments(userPromptEmbedding, convName, source);
    if (semanticResult.length > 0) {
        for (const point of semanticResult) {
            if (!isConversationPayload(point.payload)) {
                continue;
            }
            const sanitizedSemanticContext = sanitizeConversation(point.payload.text, point.payload.role);
            contexts.push(sanitizedSemanticContext);
        }
    }
    const elasticSearchResult = await keywordStore.searchDocuments(userResponse, convName, source);
    if (elasticSearchResult.length > 0) {
        for (const result of elasticSearchResult) {
            if (!result._source || result._source.sourceType !== "conversation") {
                continue;
            }
            const sanitizedElasticContext = sanitizeConversation(result._source.text, result._source.role);
            contexts.push(sanitizedElasticContext);
        }
    }
    if (contexts.length > 0) {
        return contexts;
    }
    return null;
}
//# sourceMappingURL=retrieve_conversation_history.js.map