import * as readline from "readline";
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
export function readUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
//# sourceMappingURL=readline.js.map