import { ai, aiModelList } from "../ai_models/gemini_model.js";
import { setAiModel } from "../config/ai.js";

export async function changeAiModel(modelName: string): Promise<boolean> {
	const modelList = await aiModelList(ai);

	const validate_model_name = modelList.filter(
		(model) => model.name === `models/${modelName}`);

	if (validate_model_name.length) {
		setAiModel(modelName);
		return true;
	}

	return false;
}
