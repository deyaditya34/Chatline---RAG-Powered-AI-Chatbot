import { aiModel } from "../config/ai.js";
import { ai, getAiModelDetails } from "../ai_models/gemini_model.js";
import type { ModelInfo } from "../types/ai.js";

export async function getModelInfo(model_name: string = aiModel): Promise<ModelInfo> {

	let model_details = await getAiModelDetails(ai, model_name);

	return model_details;
}
