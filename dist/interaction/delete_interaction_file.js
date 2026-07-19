import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";
export function deleteInteractionFile(convName) {
    const convFile = path.join(interactionsDir, convName);
    try {
        fs.unlinkSync(convFile);
    }
    catch (err) {
        console.log("err in deleting file -", err);
    }
}
//# sourceMappingURL=delete_interaction_file.js.map