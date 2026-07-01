import * as vector_store from "../databases/qdrant.js";
import * as elastic_store from "../databases/elastic_search.js";

export async function store_uploaded_doc(
	conv_name,
	document_id,
	uploaded_at,
	text,
	embedding,
	source_type = "document"
) {
	let chunk_details = {
		conversation_id: conv_name,
		document_id: document_id,
		uploaded_at: uploaded_at,
		text: text,
		embedding: embedding,
		source_type: source_type
	}

	await vector_store.insert_documents(
		[
			{
				embedding: chunk_details.embedding,
				payload: {
					text: chunk_details.text,
					conversation_id: chunk_details.conversation_id,
					document_id: chunk_details.document_id,
					source_type: chunk_details.source_type,
					uploaded_at: chunk_details.uploaded_at
				}
			}
		]
	)

	await elastic_store.insert_document({
		text: chunk_details.text,
		conversation_id: chunk_details.conversation_id,
		document_id: chunk_details.document_id,
		uploaded_at: chunk_details.uploaded_at,
		source_type: chunk_details.source_type
	})
}
