import fs from "fs";
import path from "path";
import { DEFAULT_MODE } from "./config/env.js";
import { userConversationsDir, conversationsDir, interactionsDir } from "./config/path.js";
export let mode = DEFAULT_MODE;
export let currentConversationId = "";
export function setConversationMode(convMode) {
    mode = convMode;
}
export function setCurrentConversationIdFromConvName(convName) {
    let baseName = convName;
    let chatTopic = baseName;
    if (!convName) {
        chatTopic = `chat ${new Date().getTime()}`;
    }
    else {
        let counter = 1;
        while (fs.existsSync(path.join(conversationsDir, chatTopic))) {
            chatTopic = `${baseName} (${counter})`;
            counter++;
        }
        ;
    }
    currentConversationId = chatTopic;
}
export function setCurrentConversationIdFromConvId(convId) {
    if (!convId) {
        console.log("usage: /switch <id>");
        return;
    }
    const conversationList = fs.readdirSync(userConversationsDir);
    const fileNo = Number(convId) - 1;
    if (fileNo > conversationList.length - 1 ||
        !Number(convId) ||
        conversationList[fileNo] === undefined) {
        console.log("invalid input");
        return;
    }
    currentConversationId = conversationList[fileNo];
}
export function setCurrentConversationIdFromInteractionName(interactionName) {
    let baseName = interactionName;
    let chatTopic = baseName;
    if (!interactionName) {
        chatTopic = `chat ${new Date().getTime()}`;
    }
    else {
        let counter = 1;
        while (fs.existsSync(path.join(interactionsDir, chatTopic))) {
            chatTopic = `${baseName} (${counter})`;
            counter++;
        }
        ;
    }
    currentConversationId = chatTopic;
}
export function setCurrentConversationIdFromInteractionId(interactionId) {
    if (!interactionId) {
        console.log("usage: /switch <id>");
        return;
    }
    const interactionList = fs.readdirSync(`${interactionsDir}`);
    const fileNo = Number(interactionId) - 1;
    if (fileNo > interactionList.length - 1 ||
        !Number(interactionId) ||
        interactionList[fileNo] === undefined) {
        console.log("invalid input");
        return;
    }
    currentConversationId = interactionList[fileNo];
}
//# sourceMappingURL=session.js.map