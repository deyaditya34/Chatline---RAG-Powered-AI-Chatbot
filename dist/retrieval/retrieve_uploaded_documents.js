import * as vectorStore from "../databases/qdrant.js";
import * as elasticStore from "../databases/elastic_search.js";
import { sanitizeConversation } from "../conversation/utils.js";
export async function retrieveUploadedDocuments(userPromptEmbedding, userResponse, convName, source = "document") {
    const contexts = [];
    const semanticResult = await vectorStore.searchDocuments(userPromptEmbedding, convName, source);
    if (semanticResult.length > 0) {
        let semanticContext = "You may use the following retrieved context derived from vector search: \n\n";
        for (const point of semanticResult) {
            semanticContext += point.payload.text + "\n\n";
        }
        const sanitizedSemanticContext = sanitizeConversation(semanticContext, "user");
        contexts.push(sanitizedSemanticContext);
    }
    const elasticSearchResult = await elasticStore.searchDocuments(userResponse, convName, source);
    if (elasticSearchResult.length > 0) {
        let elasticContext = "You may use the following retrieved context derived from elastic search: \n\n";
        for (const result of elasticSearchResult) {
            if (!result._source) {
                continue;
            }
            elasticContext += result._source.text + "\n\n";
        }
        const sanitizedElasticContext = sanitizeConversation(elasticContext, "user");
        contexts.push(sanitizedElasticContext);
    }
    if (contexts.length > 0) {
        return contexts;
    }
    return null;
}
//# sourceMappingURL=retrieve_uploaded_documents.js.map