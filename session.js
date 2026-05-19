import fs from "fs";

export let mode = process.env.DEFAULT_MODE;
export let current_conversation_id;

export function set_conversation_mode(conv_mode) {
	mode = conv_mode;
}

export async function set_current_conversation_id_for_new_conv(conv_name) {
	let chat_topic;

	if (!conv_name) {
		chat_topic = `chat ${new Date().getTime()}`;
	} else {
		chat_topic = `${conv_name}`;
	}

	current_conversation_id = chat_topic;
}

export async function set_current_conversation_id_for_switch_conv(conv_id) {
	if (!conv_id) {
		console.log("usage: /switch <id>");
		return;
	}

	const chat_save_dir_for_user =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const conversation_list = await fs.readdirSync(
		`${chat_save_dir_for_user}`
	);

	const fileNo = Number(conv_id) - 1;

	if (fileNo > conversation_list.length - 1 || !Number(conv_id)) {
		console.log("invalid input");
		return;
	}

	current_conversation_id = conversation_list[fileNo];
}
