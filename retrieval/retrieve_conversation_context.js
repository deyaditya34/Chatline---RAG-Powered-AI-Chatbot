import * as vector_store from "../databases/qdrant.js";
import * as keyword_store from "../databases/elastic_search.js";

export async function retrieve_conversation_context(
	user_prompt_embedding,
	user_response,
	conv_name,
	source
) {
	const contexts = [];

	const semantic_result = await vector_store.search_documents(
		user_prompt_embedding,
		conv_name,
		source
	);

	if (semantic_result.length > 0) {
		for (const point of semantic_result) {
			const sanitized_semantic_context = sanitize_conversation(
				point.payload.text,
				point.payload.role
			);
			contexts.push(sanitized_semantic_context);
		}
	}

	const elastic_search_result = await keyword_store.search_documents(
		user_response,
		conv_name,
		source
	);

	if (elastic_search_result.length > 0) {
		for (const result of elastic_search_result) {
			const sanitized_elastic_context = sanitize_conversation(
				result._source.text,
				result._source.role
			);
			contexts.push(sanitized_elastic_context);
		}
	}

	if (contexts.length > 0) {
		return contexts;
	}

	return null;
}
