export function parseCommand(input) {
    let [command, ...args] = input.split(" ");
    command = command.slice(1, command.length);
    return [command, args];
}
//# sourceMappingURL=utils.js.map