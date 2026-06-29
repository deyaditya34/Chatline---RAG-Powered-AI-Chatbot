import * as vector_store from "../databases/qdrant.js";
import * as elastic_store from "../databases/elastic_search.js";

export async function retrieve_uploaded_documents(
	user_prompt_embedding,
	user_response,
	conv_name,
	source="document"
) {
	const contexts = [];

	const semantic_result = await vector_store.search_documents(
		user_prompt_embedding,
		conv_name,
		source
	);

	if (semantic_result.length > 0) {
		let semantic_context = "You may use the following retrieved context derived from vector search: \n\n";
		for (const point of semantic_result) {
			semantic_context += point.payload.text + "\n\n";
		}
		const sanitized_semantic_context = sanitize_conversation(semantic_context, "user");
		contexts.push(sanitized_semantic_context);
	}

	const elastic_search_result = await elastic_store.search_documents(
		user_response,
		conv_name,
		source
	);

	if (elastic_search_result.length > 0) {
		let elastic_context = "You may use the following retrieved context derived from elastic search: \n\n";
		for (const result of elastic_search_result) {
			elastic_context += result._source.text + "\n\n";
		}
		const sanitized_elastic_context = sanitize_conversation(elastic_context, "user");
		contexts.push(sanitized_elastic_context);
	}

	if (contexts.length > 0) {
		return contexts;
	}

	return null;
}
