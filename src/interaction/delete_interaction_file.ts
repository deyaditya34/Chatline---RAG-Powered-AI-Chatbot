import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export function deleteInteractionFile(convName: string): void {

	const convFile = path.join(interactionsDir, convName);

	try {
		fs.unlinkSync(convFile);
	} catch (err) {
		wrapError(err, FileError, "failed to delete interaction file")
	}
}
