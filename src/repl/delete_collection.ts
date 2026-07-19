import { deleteDocument } from "../databases/qdrant.js";

export async function deleteColl(): Promise<void> {
	let result;
	try {
		result = await deleteDocument();
	} catch (err) {
		if (err instanceof Error) {
			console.log("err -", err.message);
		} else {
			console.log(err);
		}
	}

	console.log(result);
}
