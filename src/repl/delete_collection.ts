import { deleteDocument } from "../databases/qdrant.js";

export async function deleteColl(): Promise<void> {
	const result = await deleteDocument();

	console.log(result);
}
