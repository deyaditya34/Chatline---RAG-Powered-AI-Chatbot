import * as vector_store from "../databases/qdrant.js";
import * as elastic_store from "../databases/elastic_search.js";

export async function store_conversation_db(
	user_response,
	model_response,
	user_prompt_embedding,
	model_response_embedding,
	conv_name
) {
	let user_prompt_chunk_payload = {
		text: user_response,
		conversation_id: conv_name,
		source_type: "conversation",
		role: "user",
		uploaded_at: Date.now(),
	}

	let model_response_chunk_payload = {
		text: model_response,
		conversation_id: conv_name,
		source_type: "conversation",
		role: "model",
		uploaded_at: Date.now()
	}

	try {
		await vector_store.insert_documents(
			[
				{
					embedding: user_prompt_embedding,
					payload: user_prompt_chunk_payload
				},
				{
					embedding: model_response_embedding,
					payload: model_response_chunk_payload
				}
			]
		);
	} catch (err) {
		console.error("err in storing the conversations as vectors -", err);
		return;
	}

	try {
		await elastic_store.insert_document(
			{
				text: user_response,
				conversation_id: conv_name,
				source_type: "conversation",
				role: "user",
				uploaded_at: Date.now()
			}
		);

		await elastic_store.insert_document(
			{
				text: model_response,
				conversation_id: conv_name,
				source_type: "conversation",
				role: "model",
				uploaded_at: Date.now()
			}
		);
	} catch (err) {
		console.error("err in storing the conversations as elastic search -", err);
	}
}
