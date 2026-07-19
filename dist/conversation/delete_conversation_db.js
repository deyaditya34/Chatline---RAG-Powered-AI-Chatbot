import * as vectorStore from "../databases/qdrant.js";
import * as elasticStore from "../databases/elastic_search.js";
export async function deleteConversationDb(convName) {
    const semantic_delete_criteria = {
        must: [
            {
                key: "conversation_id",
                match: {
                    value: convName
                }
            }
        ]
    };
    await vectorStore.deleteDocument(semantic_delete_criteria);
    await elasticStore.deleteConversation(convName);
}
//# sourceMappingURL=delete_conversation_db.js.map