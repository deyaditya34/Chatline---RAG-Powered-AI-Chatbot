export function parse_command(input) {
	let [command, ...args] = input.split(" ");

	command = command.slice(1, command.length);
	return [command, args];
}

