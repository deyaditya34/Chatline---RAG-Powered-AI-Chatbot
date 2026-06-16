import { Client } from "@elastic/elasticsearch";

const client = new Client({
	node: "http://127.0.0.1:9200"
});

export async function create_index(index_name) {
	try {
		const exists = await client.indices.exists(
			{ index: index_name }
		)

		if (!exists) {
			await client.indices.create(
				{ index: index_name }
			);

			console.log(`Index '${index_name}' created`);
			console.log(`Index '${index_name}' initialized`);
		} else {
			console.log(`Index '${index_name}' initialized`);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function insert_document(document) {
	const response = await client.index({
		index: process.env.ELASTIC_DB_COLLECTION_NAME,
		document
	});

	return response;
}

export async function search_document(user_query, size = 5) {
	const response = await client.search({
		index: process.env.ELASTIC_DB_COLLECTION_NAME,
		size,
		query: {
			match: {
				text: user_query
			}
		}
	})

	return response.hits.hits;
}

export async function get_indices() {
	const response = await client.indices.getMapping({
		index: process.env.ELASTIC_DB_COLLECTION_NAME
	});

	return response;
}

export async function search_in_uploaded_docs(
	user_query,
	conversation_id,
	size = 5
) {
	const response = await client.search({
		index: process.env.ELASTIC_DB_COLLECTION_NAME,
		size,
		query: {
			bool: {
				must: [
					{
						match: {
							text: user_query
						}
					}
				],
				filter: [
					{
						term: {
							"conversation_id.keyword": conversation_id
						}
					},
					{
						term: {
							"source_type.keyword": "document"
						}
					}
				]
			}
		}
	});

	return response.hits.hits;
}

export async function search_in_past_conversation(
	user_query,
	conversation_id,
	size = 5
) {
	const response = await client.search({
		index: process.env.ELASTIC_DB_COLLECTION_NAME,
		size,
		query: {
			bool: {
				must: [
					{
						match: {
							text: user_query
						}
					}
				],
				filter: [
					{
						term: {
							"conversation_id.keyword": conversation_id
						}
					},
					{
						term: {
							"source_type.keyword": "conversation"
						}
					}
				]
			}
		}
	});

	return response.hits.hits;
}

export async function delete_document(document_id) {
	const response = await client.delete({
		index: process.env.ELASTIC_DB_COLLECTION_NAME,
		id: document_id
	})

	return response;
}

export async function delete_index() {
	const response = await client.indices.delete({
		index: process.env.ELASTIC_DB_COLLECTION_NAME
	});

	return response;
}
