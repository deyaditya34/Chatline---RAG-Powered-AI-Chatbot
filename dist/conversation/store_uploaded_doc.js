import * as vectorStore from "../databases/qdrant.js";
import * as elasticStore from "../databases/elastic_search.js";
export async function storeUploadedDoc(convName, documentId, uploadedAt, text, embedding) {
    let chunk_details = {
        conversationId: convName,
        documentId: documentId,
        uploadedAt: uploadedAt,
        text: text,
        sourceType: "document"
    };
    await vectorStore.insertDocuments([
        {
            embedding: embedding,
            payload: {
                text: chunk_details.text,
                conversationId: chunk_details.conversationId,
                documentId: chunk_details.documentId,
                sourceType: chunk_details.sourceType,
                uploadedAt: chunk_details.uploadedAt
            }
        }
    ]);
    await elasticStore.insertDocument({
        text: chunk_details.text,
        conversationId: chunk_details.conversationId,
        documentId: chunk_details.documentId,
        uploadedAt: chunk_details.uploadedAt,
        sourceType: chunk_details.sourceType
    });
}
//# sourceMappingURL=store_uploaded_doc.js.map