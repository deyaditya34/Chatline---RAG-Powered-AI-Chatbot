import {} from "@google/genai";
import { embedContent } from "../ai_models/gemini_model.js";
export async function createEmbedding(content) {
    const result = await embedContent(content);
    return result.embedding.values;
}
//# sourceMappingURL=create_embedding.js.map