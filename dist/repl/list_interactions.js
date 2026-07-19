import fs from "fs";
import { printList } from "../cli/output.js";
import { interactionsDir } from "../config/path.js";
export function listInteraction() {
    const interaction_list = fs.readdirSync(interactionsDir);
    if (!interaction_list.length) {
        console.log("no existing interaction found");
        return;
    }
    printList(interaction_list);
}
//# sourceMappingURL=list_interactions.js.map