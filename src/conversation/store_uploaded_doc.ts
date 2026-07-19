import * as vectorStore from "../databases/qdrant.js";
import * as elasticStore from "../databases/elastic_search.js";
import type { UploadDocumentPayload } from "../types/vectorDb.js";

export async function storeUploadedDoc(
	convName: string,
	documentId: string,
	uploadedAt: number,
	text: string,
	embedding: number[],
): Promise<void> {
	let chunk_details: UploadDocumentPayload = {
		conversationId: convName,
		documentId: documentId,
		uploadedAt: uploadedAt,
		text: text,
		sourceType: "document"
	}

	await vectorStore.insertDocuments(
		[
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
		]
	)

	await elasticStore.insertDocument({
		text: chunk_details.text,
		conversationId: chunk_details.conversationId,
		documentId: chunk_details.documentId,
		uploadedAt: chunk_details.uploadedAt,
		sourceType: chunk_details.sourceType
	})
}
