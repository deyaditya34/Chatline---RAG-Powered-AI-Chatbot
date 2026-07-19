import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";
export function storeInteraction(convName, interactionHistory) {
    fs.writeFileSync(path.join(interactionsDir, convName), JSON.stringify(interactionHistory));
}
//# sourceMappingURL=store_interaction.js.map