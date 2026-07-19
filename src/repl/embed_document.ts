import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import readline from "readline";
import { printMessage } from "../cli/output.js";
import { sanitizeConversation } from "../conversation/utils.js";
import { loadConversationUser } from "../conversation/load_conversation_user.js";
import { createEmbedding } from "../embedding/create_embedding.js";
import { storeUploadedDoc } from "../conversation/store_uploaded_doc.js";
import { storeConversationUserFile } from "../conversation/store_conversation_user_file.js";

export async function embedDocument(docPath: string, convName: string): Promise<void> {

	let parsedConversationHistoryUser = await loadConversationUser(convName);

	let documentDetails = {
		fileName: docPath,
		documentId: uuidv4(),
		uploadedAt: Date.now(),
	}

	parsedConversationHistoryUser.uploadDocuments.push(documentDetails);

	const inputStream = fs.createReadStream(docPath);

	const rl = readline.createInterface({
		input: inputStream,
		crlfDelay: Infinity
	});

	let paragraph = "";

	for await (const line of rl) {
		//empty line means paragraph ended
		if (line.trim() === "") {
			if (paragraph.trim()) {

				const sanitizedDocumentChunk = sanitizeConversation(paragraph, "user");
				const embedding = await createEmbedding(sanitizedDocumentChunk);

				await storeUploadedDoc(
					convName,
					documentDetails.documentId,
					documentDetails.uploadedAt,
					paragraph,
					embedding
				);

				paragraph = "";
			}
		} else {
			paragraph += line + "\n";
		}
	}

	if (paragraph.trim()) {
		const sanitizedDocumentChunk = sanitizeConversation(paragraph, "user");
		const embedding = await createEmbedding(sanitizedDocumentChunk);

		await storeUploadedDoc(
			convName,
			documentDetails.documentId,
			documentDetails.uploadedAt,
			paragraph,
			embedding
		);
	}

	await storeConversationUserFile(
		convName,
		parsedConversationHistoryUser
	);

	printMessage(`file - '${docPath}' embedding completed.`);
}

