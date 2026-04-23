import { ai, ai_model, set_ai_model, ai_model_list } from "../ai_model.js";

export async function change_ai_model(model_name) {
	const model_list = await ai_model_list(ai);

	const validate_model_name = model_list.filter(
		(model) => model.name === `models/${model_name}`);

	if (validate_model_name.length) {
		set_ai_model(model_name);
		return true;
	}

	return false;
}
