import { delete_document } from "../databases/qdrant.js";

export async function delete_coll() {
	let result;
	try {
		result = await delete_document();
	} catch (err) {
		console.log("err -", err.code);
	}

	console.log(result);
}
