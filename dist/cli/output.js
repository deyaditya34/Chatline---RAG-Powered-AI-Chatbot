import {} from "../types/ai.js";
import {} from "../types/output.js";
export function printList(list) {
    process.stdout.write(`\x1B[38;2;255;180;180m`);
    for (let i = 0; i < list.length; i++) {
        console.log(`${i + 1} ${list[i]}`);
    }
    process.stdout.write(`\x1B[0m`);
}
export function printMessage(message) {
    process.stdout.write(`\x1B[38;2;255;180;180m[Model]: ${message}`);
    process.stdout.write(`\x1B[0m\n`);
}
export function printConversation(message, entity, job) {
    if (job === "conversation" || job === "interaction") {
        const [firstLine, ...rest] = message.split("\n");
        if (entity === "model") {
            console.log(`\x1B[38;2;255;180;180m[${entity}]: ${firstLine}`);
        }
        else {
            console.log(`\x1B[38;2;160;160;220m${entity} ${firstLine}`);
        }
        for (const line of rest) {
            if (entity === "model") {
                console.log(" ".repeat(`[${entity}]: `.length) + line);
            }
            else {
                console.log(" ".repeat(entity.length) + line);
            }
        }
        process.stdout.write("\x1B[0m");
    }
}
export function printModelInfo(modelInfo) {
    console.log(`\x1B[38;2;255;180;180m[model]: \x1B[0m`);
    console.table(modelInfo);
}
export function printModelList(modelList) {
    console.log(`\x1B[38;2;255;180;180m[model]: \x1B[0m`);
    console.table(modelList);
}
//# sourceMappingURL=output.js.map