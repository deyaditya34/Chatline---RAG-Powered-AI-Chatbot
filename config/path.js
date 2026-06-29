import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const DATA_DIR = process.env.DATA_DIR;

export const CONVERSATIONS_DIR = path.join(DATA_DIR, process.env.CONVERSATIONS_DIR);
export const INTERACTIONS_DIR = path.join(DATA_DIR, process.env.INTERACTIONS_DIR);

export const USER_CONVERSATIONS_DIR = path.join(
	CONVERSATIONS_DIR, 
	process.env.USER_CONVERSATIONS_DIR
);
export const MODEL_CONVERSATIONS_DIR = path.join(
	CONVERSATIONS_DIR, 
	process.env.MODEL_CONVERSATIONS_DIR
);

