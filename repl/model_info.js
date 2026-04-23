import { ai, ai_model, get_ai_model_details } from "../ai_model.js";

export async function get_model_info(model_name = ai_model) {

	let model_details = await get_ai_model_details(ai, model_name);

	return model_details;
}
