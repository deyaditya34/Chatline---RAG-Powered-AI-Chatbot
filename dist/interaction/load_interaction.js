import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";
export function loadInteraction(convName) {
    const interactionHistory = fs.readFileSync(path.join(interactionsDir, convName));
    let parsedInteractionHistory = JSON.parse(interactionHistory.toString());
    return parsedInteractionHistory;
}
//# sourceMappingURL=load_interaction.js.map