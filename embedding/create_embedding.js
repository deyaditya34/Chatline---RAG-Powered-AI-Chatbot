import { embed_content } from "../ai_models/gemini_model.js";

export async function create_embedding(content) {
	const result = await embed_content(content);

	return result.embedding.values;
}
