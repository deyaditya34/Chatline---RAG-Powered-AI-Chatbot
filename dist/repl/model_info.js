import { aiModel } from "../config/ai.js";
import { ai, getAiModelDetails } from "../ai_models/gemini_model.js";
export async function getModelInfo(model_name = aiModel) {
    let model_details = await getAiModelDetails(ai, model_name);
    return model_details;
}
//# sourceMappingURL=model_info.js.map