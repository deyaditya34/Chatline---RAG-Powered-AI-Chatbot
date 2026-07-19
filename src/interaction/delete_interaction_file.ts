import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";

export function deleteInteractionFile(convName: string): void {

	const convFile = path.join(interactionsDir, convName);

	try {
	 	fs.unlinkSync(convFile);
	} catch (err) {
		console.log("err in deleting file -", err);
	}
}
