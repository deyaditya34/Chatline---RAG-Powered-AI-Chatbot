import { delete_document } from "../database.js";

export async function delete_collection() {
	let result;
	try {
		result = await delete_document();
	} catch (err) {
		console.log("err -", err.code);
	}

	console.log(result);
}
