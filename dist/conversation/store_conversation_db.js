import * as vectorStore from "../databases/qdrant.js";
import * as elasticStore from "../databases/elastic_search.js";
export async function storeConversationDb(userResponse, modelResponse, userPromptEmbedding, modelResponseEmbedding, convName) {
    let userPromptChunkPayload = {
        text: userResponse,
        conversationId: convName,
        sourceType: "conversation",
        role: "user",
        uploadedAt: Date.now(),
    };
    let modelResponseChunkPayload = {
        text: modelResponse,
        conversationId: convName,
        sourceType: "conversation",
        role: "model",
        uploadedAt: Date.now()
    };
    try {
        await vectorStore.insertDocuments([
            {
                embedding: userPromptEmbedding,
                payload: userPromptChunkPayload
            },
            {
                embedding: modelResponseEmbedding,
                payload: modelResponseChunkPayload
            }
        ]);
    }
    catch (err) {
        console.error("err in storing the conversations as vectors -", err);
        return;
    }
    try {
        await elasticStore.insertDocument({
            text: userResponse,
            conversationId: convName,
            sourceType: "conversation",
            role: "user",
            uploadedAt: Date.now()
        });
        await elasticStore.insertDocument({
            text: modelResponse,
            conversationId: convName,
            sourceType: "conversation",
            role: "model",
            uploadedAt: Date.now()
        });
    }
    catch (err) {
        console.error("err in storing the conversations as elastic search -", err);
    }
}
//# sourceMappingURL=store_conversation_db.js.map